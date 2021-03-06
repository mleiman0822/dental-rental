import axios from "axios";
import { put, takeEvery, takeLatest, select } from "redux-saga/effects";

function* createEquipment(action) {
  try {
    // clear any alerts that may be in there already
    yield put({ type: "CLEAR_ALERT" });

    yield axios.post("/api/inventory", action.payload);
    // dispatch an alert that the upload was successful
    yield put({
      type: "SET_ALERT",
      payload: {
        message: "Successfully created Equipment",
        alert: "alert-success",
      },
    });
    // refresh list of uploads
    yield put({ type: "FETCH_INVENTORY" });
  } catch (error) {
    // dispatch an error that the upload was rejected
    yield put({
      type: "SET_ALERT",
      payload: { message: "Error creating Equipment", alert: "alert-error" },
    });
    console.log("Error getting equipment items from server:", error);
  }
}

function* editStatus(action) {
  console.log(action.payload);
  try {
    const response = yield axios.put(
      `/api/inventory/${action.payload.equipment_id}`,
      {
        equipment_status: action.payload.equipment_status,
      }
    );

    yield put({ type: "SET_STATUS", payload: response.data });

    console.log("Success in updating Status.");
  } catch (error) {
    console.log("error editing Status", error);
  }
}

function* editNote(action) {
  console.log(action.payload);
  try {
    const response = yield axios.put(
      `/api/inventory/${action.payload.equipment_id}/update-note`,
      {
        note: action.payload.note,
      }
    );

    console.log("Success in updating Note.");
  } catch (error) {
    console.log("error editing Note", error);
  }
}

function* fetchInventory() {
  try {

    const response = yield axios.get("/api/inventory");
    yield put({ type: "SET_INVENTORY", payload: response.data }); // add the upload to the redux store

  } catch (error) {
    // dispatch an error that the upload was rejected
    yield put({
      type: "SET_ALERT",
      payload: {
        message: "Error retrieving inventory items",
        alert: "alert-error",
      },
    });
    console.log("Error getting Equipment from server:", error);
  }
}

// function* fetchFilteredInventory() {
//   try {
//     console.log(payload);
//     // const response = yield axios.get(`/api/inventory/filterinv/${this.state.filterStatus[0].value}`)
//   }
// }

function* fetchFilteredInventory(action) {
  try {

    console.log(`Filtered inventory: ${action.payload}`);

    const response = yield axios.get(`/api/inventory/filterinv/${action.payload}`);
    yield put({ type: "SET_INVENTORY", payload: response.data });

  } catch (error) {
    yield put({
      type: "SET_ALERT",
      payload: {
        message: "Error retrieving inventory items",
        alert: "alert-error",
      },
    });
    console.log("Error getting Equipment from server:", error);
  };
};

function* inventoryViewSaga() {
  yield takeEvery("CREATE_ITEM", createEquipment);
  yield takeEvery("FETCH_INVENTORY", fetchInventory);
  yield takeEvery('FETCH_FILTERED_INVENTORY', fetchFilteredInventory);
  yield takeEvery("EDIT_STATUS", editStatus);
  yield takeEvery("EDIT_NOTE", editNote);
}

export default inventoryViewSaga;
