import React, { useState } from "react";

const ClassroomManagement = () => {
  const [rooms, setRooms] = useState([
    {
      id: 1,
      name: "Phòng 101",
      capacity: 30,
      status: "Available",
      location: "Tầng 1",
      schedule: [
        { ca: 1, date: "2024-10-01" },
        { ca: 3, date: "2024-10-01" },
        { ca: 6, date: "2024-10-01" },
        { ca: 2, date: "2024-10-02" },
        { ca: 1, date: "2024-10-03" },
        { ca: 1, date: "2024-10-04" },
      ],
    },
    {
      id: 2,
      name: "Phòng 102",
      capacity: 30,
      status: "Available",
      location: "Tầng 1",
      schedule: [
        { ca: 1, date: "2024-10-01" },
        { ca: 2, date: "2024-10-02" },
      ],
    },
  ]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [currentRoomId, setCurrentRoomId] = useState(null); 

  const handleDelete = (id) => {
    const newRooms = rooms.filter((room) => room.id !== id);
    setRooms(newRooms);
    alert("Xóa thành công!");
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setEditingRoom(null);
    setIsModalOpen(false);
    setShowCalendarModal(false);
  };

  const handleOk = (event) => {
    event.preventDefault();
    const form = event.target;
    const values = {
      name: form.name.value,
      location: form.location.value,
      capacity: form.capacity.value,
      status: form.status.value,
      startDate: form.startDate.value,
      numberOfClasses: form.numberOfClasses.value,
    };

    if (editingRoom) {
      setRooms(
        rooms.map((room) =>
          room.id === editingRoom.id ? { ...editingRoom, ...values } : room
        )
      );
      alert("Cập nhật phòng học thành công!");
    } else {
      setRooms([...rooms, { id: rooms.length + 1, ...values }]);
      alert("Thêm phòng học mới thành công!");
    }
    setIsModalOpen(false);
  };

  return (
    <div className="container">
      <button
        className="btn btn-primary mb-3"
        onClick={() => setIsModalOpen(true)}
      >
        Thêm phòng học
      </button>

      <table className="table">
        <thead>
          <tr>
            <th>Tên phòng</th>
            <th>Vị trí</th>
            <th>Sức chứa</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.id}>
              <td>{room.name}</td>
              <td>{room.location}</td>
              <td>{room.capacity}</td>
              <td>{room.status}</td>
              <td>
                <button
                  className="btn btn-primary me-2"
                  onClick={() => handleEdit(room)}
                >
                  Sửa
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(room.id)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Add/Edit */}
      {isModalOpen && (
        <div className="modal show" tabIndex="-1" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingRoom ? "Chỉnh sửa phòng học" : "Thêm phòng học"}
                </h5>
                <button type="button" className="btn-close" onClick={handleCancel}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleOk}>
                  <div className="mb-3">
                    <label className="form-label">Tên phòng</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      defaultValue={editingRoom?.name || ""}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Vị trí</label>
                    <input
                      type="text"
                      name="location"
                      className="form-control"
                      defaultValue={editingRoom?.location || ""}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Sức chứa</label>
                    <input
                      type="number"
                      name="capacity"
                      className="form-control"
                      defaultValue={editingRoom?.capacity || ""}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Trạng thái</label>
                    <input
                      type="text"
                      name="status"
                      className="form-control"
                      defaultValue={editingRoom?.status || ""}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Ngày bắt đầu</label>
                    <input
                      type="date"
                      name="startDate"
                      className="form-control"
                      defaultValue={editingRoom?.startDate || ""}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Số buổi học</label>
                    <input
                      type="number"
                      name="numberOfClasses"
                      className="form-control"
                      defaultValue={editingRoom?.numberOfClasses || 17}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    {editingRoom ? "Cập nhật" : "Thêm mới"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassroomManagement;
