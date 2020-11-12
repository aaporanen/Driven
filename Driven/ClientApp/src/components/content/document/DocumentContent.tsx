import React from "react";
import { Button, Dialog, DialogActions, DialogContent, TextField } from "@material-ui/core";
import { IDocument } from "../../../models/IDocument";

const DocumentContent: React.FC<{
    document?: IDocument,
    onSave: (document: IDocument) => void,
    onCancel: () => void
}> = ({ document, onSave, onCancel }) => {
    const [editorContent, setEditorContent] = React.useState<string>(document?.content ?? "")
    return (
        <Dialog 
            disableBackdropClick
            open={!!document}
            fullWidth
            onClose={onCancel} 
            aria-labelledby="form-dialog-title"
            onExit={e => setEditorContent("")}
        >
        <DialogContent>
          <TextField
            multiline
            rows={20}
            autoFocus
            margin="dense"
            id="content"
            value={editorContent}
            onChange={e => setEditorContent(e.target.value)}
            fullWidth
            variant="outlined"
            label={document?.name}
          />
        </DialogContent>
        <DialogActions>
        <Button onClick={e => onCancel()} color="primary">
            Cancel
          </Button>
          <Button onClick={e => onSave({ ...document, content: editorContent })} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
}

export default DocumentContent;