import React, { useState, useEffect, useRef } from "react";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { Form, InputGroup, Button} from 'react-bootstrap'
import Swal from 'sweetalert2';
import TasksModal from './TasksModal';
import 'bootstrap/dist/css/bootstrap.css';
import { XLg, TrashFill } from "react-bootstrap-icons"


export default function Task() {
  const taskRef = useRef(null);
  const _dateRef = useRef(null);
  const [taskData, setTaskData] = useState([]);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedForms, setSelectedForms] = useState([]);
  const [editFormId, setEditFormId] = useState(null);
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem('taskData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      if (Array.isArray(parsedData)) {
        setTaskData(parsedData);
      } else {
        setTaskData([]);
      }
    }
  }, []);

  const handleSave = (e) => {
    e.preventDefault();

    const task = taskRef.current.value.trim();
    const _date = _dateRef.current.value.trim();

    // For validations if the form has an empty field
    if (task === '' || _date === '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill out all the fields!',
      });
      return;
    }

    const newTaskData = {
      id: Date.now(),
      date: _date,
      task: task,
    };

    // To collect the prev data inside the contactData and to add the new data
    const updatedTaskData = [...taskData, newTaskData];

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

    // To put the new task to the local storage
    localStorage.setItem('taskData', JSON.stringify(updatedTaskData));
    setTaskData(updatedTaskData);

    // Clear the form fields
    _dateRef.current.value = '';
    taskRef.current.value = '';
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
        const updatedTaskData = taskData.filter((data) => !selectedForms.includes(data.id));
        setTaskData(updatedTaskData);
        localStorage.setItem('taskData', JSON.stringify(updatedTaskData));
        setSelectedForms([]);
        setSelectMode(false);

        Swal.fire({
          title: 'Deleted!',
          text: 'Your selected task have been deleted.',
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
    const updatedTaskData = taskData.map((data) => {
      if (data.id === editFormId) { // Use the 'editFormId' state variable
        return { ...data, ...updatedData };
      }
      return data;
    });
  
    localStorage.setItem('taskData', JSON.stringify(updatedTaskData));
    setTaskData(updatedTaskData);
    setModalShow(false); // Close the modal after successful edit
  };

  return (
    <div className='p-5'>
        <Form className='form-control p-3 bg-light'>
          <div className="d-flex justify-content-between">
            <h2 className='text-dark w-100'>Tasks to be done</h2>

            {/* date */}
            <InputGroup type='date'>
              <input
                type='date'
                className='btn btn-outline-dark mb-3 ms-auto'
                id='_date'
                ref={_dateRef}
                required
              />
            </InputGroup>
            </div>
          {/* input field */}
          <FloatingLabel controlId="floatingTextarea2" label={<span style={{ color: 'grey'}}>What's your task?</span>}>
            <Form.Control
              as="textarea"
              placeholder="Leave a comment here"
              style={{ height: '200px' }}
              id='task'
              ref={taskRef}
              required
              className="mb-3"
            />
          </FloatingLabel>

          {/* Button */}
          <Button type="submit" variant="primary" id="send" onClick={handleSave} style={{ width: '100%' }}>
            Save
          </Button>
        </Form>
        
      {/* Render Task for the day */}
      {taskData.length > 0 && (
        <div className="mt-4">
          <div className="d-flex justify-content-between">
            <h3>
              Tasks:{' '}</h3>
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
            {taskData.map((data) => (
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
                  {data.task}
                </Form>
              </Form>
            ))}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <TasksModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        formData={taskData.find((data) => data.id === editFormId)}
        handleUpdateForm={handleUpdateForm}
      />
    </div>
  );
}