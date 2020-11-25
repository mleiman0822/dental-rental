import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import Select from 'react-select';
import { Form, Button, Modal } from "react-bootstrap";

class SubmissionForm extends Component {
  state = {
    pointOfContact: "",
    city: "",
    phoneNumber: "", //TODO: NEEDS TO BE NUMBER
    practiceCompany: "",
    address: "",
    purposeForRequest: "",
    startDate: new Date(),
    endDate: new Date(),
    availableEquipment: [], //an arr containing all equipment that is available for a given date range
    arrOptions: [], //an arr that holds all available equipment that is valid for the react-select dropdown menu
    currentlySelectedEquipment: "", //will be an array of equipment objects that have been selected by the user
    state: "",
    zip: "",
    email: "",
    show: false,
    formSubmissionSuccess: "",
  };

  handleSubmit = (event) => {
    event.preventDefault();
    if (!(this.state.currentlySelectedEquipment)) {
      alert("Error: you cannot submit a form without selected equipment.");
      return;
    }
    axios
      .post("/api/requests/", {
        company: this.state.practiceCompany,
        address: this.state.address,
        point_of_contact: this.state.pointOfContact,
        email: this.state.email,
        phone_number: this.state.phoneNumber,
        city: this.state.city,
        state: this.state.state,
        zip: this.state.zip,
        start_date: this.state.startDate,
        end_date: this.state.endDate,
        purpose: this.state.purposeForRequest,
        equipment_in_request: this.state.currentlySelectedEquipment,

      })
      .then(() => {
        this.setState({
          formSubmissionSuccess: true,
          show: true,
          pointOfContact: "",
          city: "",
          phoneNumber: "", //TODO: NEEDS TO BE NUMBER
          practiceCompany: "",
          address: "",
          purposeForRequest: "",
          availableEquipment: [], //an arr containing all equipment that is available for a given date range
          arrOptions: [], //an arr that holds all available equipment that is valid for the react-select dropdown menu
          currentlySelectedEquipment: "", //will be an array of equipment objects that have been selected by the user
          state: "",
          zip: "",
          email: "",

        });
        console.log('Post successful.');
      })
      .catch((err) => {
        console.log(err)
        this.setState({ formSubmissionSuccess: false, show: true });
      });

  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSelect = (arrOfSelectedEquipment) => {
    this.setState({ currentlySelectedEquipment: arrOfSelectedEquipment })
  };

  handleDateChange = (dateParam, date) => {
    const currentDate = new Date();
    if (dateParam === "startDate" && date <= this.state.endDate && date >= currentDate) { // if we are editing the startDate, check that the date variable is less than or equal to the endDate
      this.setState({ startDate: date });
      this.fetchAvailableEquipment(date, this.state.endDate); //due to asynchonous nature of setting state
      this.setState({ currentlySelectedEquipment: "" }); // if the user decides to change the date, we need to remove the currently selected equipment bc it is no longer valid!
    }
    else if (dateParam === "endDate" && date >= this.state.startDate && date >= currentDate) { // if we are editing the endDate, check that the date variable is greater than the startDate
      this.setState({ endDate: date });
      this.fetchAvailableEquipment(this.state.startDate, date); //due to asynchonous nature of setting state
      this.setState({ currentlySelectedEquipment: "" }); // if the user decides to change the date, we need to remove the currently selected equipment bc it is no longer valid!
    }

  };

  fetchAvailableEquipment = (startDate, endDate) => {
    axios
      .post("/api/inventory/all-inventory-by-date-range/", {
        startDate,
        endDate
      })
      .then((res) => {
        this.setState({ availableEquipment: res.data });
        const options = res.data.map((equipmentObj) => {
          return { value: equipmentObj.id, label: equipmentObj.equipment_item, ...equipmentObj } //value allows us to select the correct equipment by using its id
        }); //value and label are keys that are required for the react-select dropdown menu
        this.setState({ arrOptions: options }); //arrOptions needed for React-Select's Select tag
      })
      .catch((err) => console.log(err));
  };

  //bootstrap modal opening/closing handlers
  handleClose = () => this.setState({ show: false });
  handleShow = () => this.setState({ show: true });

  render() {
    return (
      <>
        {/* <Button onClick={this.handleShow}>Show modal</Button> */}
        <h1>Dental Rental Request</h1>

        <Form onSubmit={this.handleSubmit}>
          Start Date:
        <DatePicker required selected={this.state.startDate} onChange={(date) => this.handleDateChange("startDate", date)} />
          {" "}
        End Date:
        <DatePicker required selected={this.state.endDate} onChange={(date) => this.handleDateChange("endDate", date)} />

          <br />
          <br />

          <Select
            isMulti
            name="available-equipment"
            options={this.state.arrOptions}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={this.handleSelect}
            value={this.state.currentlySelectedEquipment || ""} //this allows for validating date changes
          />

          <br />

          <input
            type="text"
            name="pointOfContact"
            placeholder="Full name"
            value={this.state.pointOfContact}
            onChange={this.handleChange}
            required
          />

          <input
            type="text"
            name="practiceCompany"
            placeholder="Practice/Company"
            value={this.state.practiceCompany}
            onChange={this.handleChange}
            required
          />

          <input
            type="text"
            name="purposeForRequest"
            placeholder="Purpose for request"
            value={this.state.purposeForRequest}
            onChange={this.handleChange}
            required
          />

          <br />
          <input
            type="number"
            name="phoneNumber"
            placeholder="Phone number"
            value={this.state.phoneNumber}
            onChange={this.handleChange}
            required
          />

          <input
            type="text"
            name="email"
            placeholder="Email"
            value={this.state.email}
            onChange={this.handleChange}
            required
          />
          <br />

          <input
            type="text"
            name="address"
            placeholder="Address"
            value={this.state.address}
            onChange={this.handleChange}
            required
          />

          <input
            type="text"
            name="city"
            placeholder="City"
            value={this.state.city}
            onChange={this.handleChange}
            required
          />

          <input
            type="text"
            name="state"
            placeholder="State"
            value={this.state.state}
            onChange={this.handleChange}
            required
          />

          <input
            type="number"
            name="zip"
            placeholder="Zip"
            value={this.state.zip}
            onChange={this.handleChange}
            required
          />

          <br />
          <br />

          <Button type="submit">Submit Request</Button>
        </Form>

        {/* Modal rendering when form submitted */}
        {this.state.formSubmissionSuccess ? <Modal
          show={this.state.show}
          onHide={this.handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header>
            <Modal.Title>Successful Form Submission</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Thank you for submitting your Dental Rental request!
             <br />
            We will review your request and get back to you promptly.
          </Modal.Body>
          <Modal.Footer>
            You will be redirected back to the ND Dental Foundation homepage in a few seconds.
            </Modal.Footer>
        </Modal> :
          <Modal
            show={this.state.show}
            onHide={this.handleClose}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header>
              <Modal.Title>Form Submission Error</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Sorry - something went wrong!
        </Modal.Body>
            <Modal.Footer>
              You will be redirected back to the ND Dental Foundation homepage in a few seconds.
          </Modal.Footer>
          </Modal>}

      </>
    );
  }
}

export default SubmissionForm;
