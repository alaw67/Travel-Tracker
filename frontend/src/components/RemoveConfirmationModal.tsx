import { Box, Typography, Button } from "@mui/material";
import { Modal } from "./Modal";

export const RemoveConfirmationModal = ({
  remove,
  setIsModalOpen,
  item,
}: {
  remove: (item: string) => void;
  setIsModalOpen: (isModalOpen: boolean) => void;
  item: string;
}) => {
  return (
    <Modal>
      <Typography
        sx={{
          textAlign: "center",
          marginX: "20px",
          marginBottom: "15px",
        }}
        variant="h6">
        {`Are you sure you want to remove ${item} from your visited countries?`}
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
        }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#de362a",
            color: "white",
            "&:hover": { backgroundColor: "#cf3227" },
          }}
          onClick={() => {
            remove(item);
            setIsModalOpen(false);
          }}>
          Remove
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            setIsModalOpen(false);
          }}>
          Cancel
        </Button>
      </Box>
    </Modal>
  );
};
