import React, { useState, useEffect, useRef } from "react";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { Form, InputGroup, Button} from 'react-bootstrap'
import Swal from 'sweetalert2';
import ThoughtsModal from './ThoughtsModal';
import 'bootstrap/dist/css/bootstrap.css';
import '../css/Form.css';
import { XLg, TrashFill } from "react-bootstrap-icons"


export default function Thoughts() {
  const thoughtsRef = useRef(null);
  const _dateRef = useRef(null);
  const [thoughtsData, setThoughtsData] = useState([]);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedForms, setSelectedForms] = useState([]);
  const [editFormId, setEditFormId] = useState(null);
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem('thoughtsData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      if (Array.isArray(parsedData)) {
        setThoughtsData(parsedData);
      } else {
        setThoughtsData([]);
      }
    }
  }, []);

  const handleSave = (e) => {
    e.preventDefault();

    const thoughts = thoughtsRef.current.value.trim();
    const _date = _dateRef.current.value.trim();

    // For validations if the form has an empty field
    if (thoughts === '' || _date === '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill out all the fields!',
      });
      return;
    }

    const newThoughtsData = {
      id: Date.now(),
      date: _date,
      thoughts: thoughts,
    };

    // To collect the prev data inside the contactData and to add the new data
    const updatedThoughtsData = [...thoughtsData, newThoughtsData];

    //
    Swal.fire({
      icon: 'success',
      title: 'Saved!',
      text: 'Your thought has been saved.',
      showConfirmButton: false,
      timer: 1500,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // To put the new thoughts to the local storage
    localStorage.setItem('thoughtsData', JSON.stringify(updatedThoughtsData));
    setThoughtsData(updatedThoughtsData);

    // Clear the form fields
    _dateRef.current.value = '';
    thoughtsRef.current.value = '';

    window.location.reload()
  }


  const handleSelectMode = () => {
    setSelectMode(!selectMode);
    setSelectedForms([]);
  };

  const handleCheckboxChange = (id) => {
    setSelectedForms((prevState) => {
      if (prevState.includes(id)) {
        return prevState.filter((formId) => formId !== id);
      } else {
        return [...prevState, id];
      }
    });
  };

  // To delete a certain form
  const handleDelete = () => {
    if (selectedForms.length === 0) {
      Swal.fire({
        title: 'No Selection',
        text: 'Please select at least one form to delete.',
        icon: 'warning',
      });
      return;
    }
    
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedThoughtsData = thoughtsData.filter((data) => !selectedForms.includes(data.id));
        setThoughtsData(updatedThoughtsData);
        localStorage.setItem('thoughtsData', JSON.stringify(updatedThoughtsData));
        setSelectedForms([]);
        setSelectMode(false);
        window.location.reload()

        Swal.fire({
          title: 'Deleted!',
          text: 'Your selected thoughts have been deleted.',
          icon: 'success',
        });
      }
    });
  };

  const handleCancel = () => {
    setSelectedForms([]);
    setSelectMode(false);
  };

  // Function to handle form editing when the Edit button is clicked
  const handleEdit = (id) => {
    setEditFormId(id);
    setModalShow(true);
  };

  // Function to handle form update inside the modal
  const handleUpdateForm = (updatedData) => { // Remove the 'id' parameter
    const updatedThoughtsData = thoughtsData.map((data) => {
      if (data.id === editFormId) { // Use the 'editFormId' state variable
        return { ...data, ...updatedData };
      }
      return data;
    });
  
    localStorage.setItem('thoughtsData', JSON.stringify(updatedThoughtsData));
    setThoughtsData(updatedThoughtsData);
    setModalShow(false); // Close the modal after successful edit
  };

  // Get the current date in the format "YYYY-MM-DD"
  const currentDate = new Date().toISOString().split('T')[0];

  return (
    <div className='p-5'>
        <Form className='form-control p-3 bg-secondary'>
          <div className="d-flex justify-content-between">
            <h4 className='text-light w-100'>Thoughts for the day</h4>

            {/* date */}
            <InputGroup type='date'>
              <input
                type='date'
                className='btn btn-outline-light mb-3 ms-auto date-picker-input'
                id='_date'
                ref={_dateRef}
                required
                readOnly // Set the input to readOnly
                defaultValue={currentDate}
              />
            </InputGroup>
            </div>
          {/* input field */}
          <FloatingLabel controlId="floatingTextarea2" label={<span style={{ color: 'grey' }}>What's on your mind?</span>}>
            <Form.Control
              as="textarea"
              placeholder="Leave a comment here"
              style={{ height: '200px' }}
              id='thoughts'
              ref={thoughtsRef}
              required
              className="mb-3"
            />
          </FloatingLabel>

          {/* Button */}
          <Button type="submit" variant="outline-light" id="send" onClick={handleSave} style={{ width: '100%' }}>
            Save
          </Button>
        </Form>
        
      {/* Render Thoughts for the day */}
      {thoughtsData.length > 0 && (
        <div className="mt-4">
          <div className="d-flex justify-content-between">
            <h3>
              Thoughts for the day:{' '}</h3>
              {!selectMode ? (
                <Button onClick={handleSelectMode} variant="outline-primary">Select</Button>
              ) : (
                <div>
                  <Button variant="danger" onClick={handleDelete}>
                    <TrashFill />
                  </Button>
                  <Button variant="secondary" onClick={handleCancel} className="ms-2">
                    <XLg />
                  </Button>
                </div>
              )}
          </div>
          <div>
            {thoughtsData.map((data) => (
              <Form className={`form-control mt-3 mb-3 bg-light${selectMode ? 'select-mode' : ''}`} key={data.id}>
                {selectMode && (
                  <div className="d-flex align-items-center"> {/* Wrap switch and edit button in a flex container */}
                    <Form.Check
                      type="switch"
                      className="checkbox"
                      checked={selectedForms.includes(data.id)}
                      onChange={() => handleCheckboxChange(data.id)}
                    />
                    <InputGroup>
                      <input
                        className='btn btn-warning ms-auto mt-2'
                        type='button'
                        onClick={() => handleEdit(data.id)} // Pass the id to the handleEdit function
                        value='Edit' />
                    </InputGroup>
                  </div>
                )}

                <hr />
                <strong className="text-secondary">Date: {data.date}</strong> 
                <br />
                <Form
                  className="form-control bg-secondary text-light"
                  style={{
                    minHeight: 100
                  }}
                >
                  {data.thoughts}
                </Form>
              </Form>
            ))}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <ThoughtsModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        formData={thoughtsData.find((data) => data.id === editFormId)}
        handleUpdateForm={handleUpdateForm}
      />
    </div>
  );
}