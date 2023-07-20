import React from 'react';
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBTextArea,
} from 'mdb-react-ui-kit';
import { Button } from 'react-bootstrap';
import Swal from 'sweetalert2'

export default function TasksModal({ show, onHide, formData, handleUpdateForm }) {
  // Remove the state variable and toggleShow function, as they are not needed in this component

  const handleSaveChanges = () => {
    // You can access the updated data from the textarea here
    const updatedData = {
      task: document.getElementById('textArea').value, // Modify this to match the ID of your textarea
    };

    handleUpdateForm(updatedData);
  };

  return (
    <MDBModal tabIndex='-1' show={show} onHide={onHide}>
      <MDBModalDialog centered>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle>Edit</MDBModalTitle>
            <MDBBtn className='btn-close' color='none' onClick={onHide}></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody>
            <p>
              <MDBTextArea
                placeholder='Message'
                id='textArea'
                rows={4}
                defaultValue={formData ? formData.task : ''} // Set the initial value of the textarea to the existing task data if editing
              />
            </p>
          </MDBModalBody>
          <MDBModalFooter>
            <Button className='btn btn-secondary' onClick={handleSaveChanges}>Cancel</Button>
            <Button className='btn btn-success'
              onClick={() => {
                handleSaveChanges();
                Swal.fire({
                  title: 'Success!',
                  text: 'Your task have been successfully edited.',
                  icon: 'success',
                });
              }}>
              Save changes
            </Button>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}
