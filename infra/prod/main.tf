provider "aws" {
  region = "ca-central-1"
}

############################
# Variables
############################
variable "vpc_id" {
  description = "Existing VPC ID"
  type        = string
}

variable "subnet_ids" {
  description = "List of existing subnet IDs (must be in at least 2 AZs for ALB)"
  type        = list(string)
}

variable "ecs_security_group_id" {
  description = "Existing security group ID for ECS tasks"
  type        = string
}

variable "alb_security_group_id" {
  description = "Existing security group ID for the ALB"
  type        = string
}

variable "ecs_execution_role_arn" {
  description = "ARN of an existing ECS Task Execution Role"
  type        = string
}

variable "ecr_image_uri" {
  description = "ECR image URI for the container"
  type        = string
}

############################
# ECS Cluster
############################
resource "aws_ecs_cluster" "trekd_cluster" {
  name = "trekd-cluster"
}

############################
# Task Definition
############################
resource "aws_ecs_task_definition" "trekd_task" {
  family                   = "trekd-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"

  execution_role_arn = var.ecs_execution_role_arn

  container_definitions = jsonencode([
    {
      name      = "trekd-container"
      image     = var.ecr_image_uri
      essential = true
      portMappings = [
        {
          containerPort = 5050
          hostPort      = 5050
        }
      ]
    }
  ])
}

############################
# Load Balancer
############################
resource "aws_lb" "trekd_alb" {
  name               = "trekd-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [var.alb_security_group_id]
  subnets            = var.subnet_ids
}

############################
# Target Group
############################
resource "aws_lb_target_group" "trekd_tg" {
  name        = "trekd-tg"
  port        = 5050
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"

  health_check {
    path                = "/health"
    matcher             = "200"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }
}

############################
# Listener
############################
resource "aws_lb_listener" "trekd_listener" {
  load_balancer_arn = aws_lb.trekd_alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.trekd_tg.arn
  }
}

############################
# ECS Service
############################
resource "aws_ecs_service" "trekd_service" {
  name            = "trekd-service"
  cluster         = aws_ecs_cluster.trekd_cluster.id
  task_definition = aws_ecs_task_definition.trekd_task.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = var.subnet_ids
    security_groups = [var.ecs_security_group_id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.trekd_tg.arn
    container_name   = "trekd-container"
    container_port   = 5050
  }

  depends_on = [aws_lb_listener.trekd_listener]
}
