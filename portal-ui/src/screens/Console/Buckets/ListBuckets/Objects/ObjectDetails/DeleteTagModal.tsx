// This file is part of MinIO Console Server
// Copyright (c) 2020 MinIO, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
} from "@material-ui/core";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { modalBasic } from "../../../../Common/FormComponents/common/styleLibrary";
import api from "../../../../../../common/api";
import Typography from "@material-ui/core/Typography";

interface IDeleteTagModal {
  deleteOpen: boolean;
  currentTags: any;
  bucketName: string;
  versionId: string | null;
  selectedTag: string[];
  onCloseAndUpdate: (refresh: boolean) => void;
  selectedObject: string;
  classes: any;
}

const styles = (theme: Theme) =>
  createStyles({
    buttonContainer: {
      textAlign: "right",
    },
    pathLabel: {
      marginTop: 0,
      marginBottom: 32,
    },
    ...modalBasic,
  });

const DeleteTagModal = ({
  deleteOpen,
  currentTags,
  selectedObject,
  selectedTag,
  onCloseAndUpdate,
  bucketName,
  versionId,
  classes,
}: IDeleteTagModal) => {
  const [deleteError, setDeleteError] = useState<string>("");
  const [deleteLoading, setDeleteSending] = useState<boolean>(false);
  const [tagKey, tagLabel] = selectedTag;

  const removeTagProcess = () => {
    setDeleteSending(true);
    const cleanObject = { ...currentTags };
    delete cleanObject[tagKey];

    api
      .invoke(
        "PUT",
        `/api/v1/buckets/${bucketName}/objects/tags?prefix=${selectedObject}&version_id=${versionId}`,
        { tags: cleanObject }
      )
      .then((res: any) => {
        setDeleteSending(false);
        onCloseAndUpdate(true);
      })
      .catch((error) => {
        setDeleteError(error);
        setDeleteSending(false);
      });
  };

  return (
    <Dialog
      open={deleteOpen}
      onClose={() => {
        onCloseAndUpdate(false);
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Delete Tag</DialogTitle>
      <DialogContent>
        {deleteLoading && <LinearProgress />}
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete the tag{" "}
          <b className={classes.wrapText}>
            {tagKey} : {tagLabel}
          </b>{" "}
          from {selectedObject}?
          {deleteError !== "" && (
            <React.Fragment>
              <br />
              <Typography
                component="p"
                variant="body1"
                className={classes.errorBlock}
              >
                {deleteError}
              </Typography>
            </React.Fragment>
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            onCloseAndUpdate(false);
          }}
          color="primary"
          disabled={deleteLoading}
        >
          Cancel
        </Button>
        <Button onClick={removeTagProcess} color="secondary" autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default withStyles(styles)(DeleteTagModal);
