import React, { useState } from 'react';
import { Table, Button, Form } from 'react-bootstrap';


const BootStrapTable=()=>{
    const [people, setPeople] = useState([]);
    const [newPerson, setNewPerson] = useState({ name: '', age: '' });
  
    const handleChange = (e) => {
      setNewPerson({
        ...newPerson,
        [e.target.name]: e.target.value,
      });
    };
  
    const addPerson = () => {
      if (newPerson.name && newPerson.age) {
        setPeople([...people, newPerson]);
        setNewPerson({ name: '', age: '' });
      }
    };
  
    const removePerson = (index) => {
      const updatedPeople = people.filter((_, i) => i !== index);
      setPeople(updatedPeople);
    };
  
    return (
      <div>
        <Form>
          <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={newPerson.name}
              onChange={handleChange}
              placeholder="Enter name"
            />
          </Form.Group>
  
          <Form.Group controlId="formAge" className="mt-2">
            <Form.Label>Age</Form.Label>
            <Form.Control
              type="text"
              name="age"
              value={newPerson.age}
              onChange={handleChange}
              placeholder="Enter age"
            />
          </Form.Group>
  
          <Button className="mt-3" onClick={addPerson}>
            Add Person
          </Button>
        </Form>
  
        <Table striped bordered hover className="mt-4">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Age</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {people.map((person, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{person.name}</td>
                <td>{person.age}</td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => removePerson(index)}
                  >
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>


        <table class="table" >
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">First</th>
      <th scope="col">Last</th>
      <th scope="col">Handle</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Jacob</td>
      <td>Thornton</td>
      <td>@fat</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td>Larry</td>
      <td>the Bird</td>
      <td>@twitter</td>
    </tr>
  </tbody>
</table>
      </div>
    );
}

export default BootStrapTable

