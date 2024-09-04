import React, {useState, useEffect} from "react";
import {
    Input,
    DatePicker,
    Space
} from 'antd';
import {
    Modal,
} from "antd";

const { TextArea } = Input;

export const ModalAddElement = ({ hideAdd, addNewTask, editTask, open, ...props }) => {
    return (
        <>
            <Modal
                title="Add todo"
                open={open}
                onOk={props.currentVal.key !== -1 ? editTask : addNewTask}
                onCancel={hideAdd}
                okText={props.currentVal.key !== -1 ? 'Edit' : 'Add'}
                cancelText='Cancel'
                zIndex={9999}
            >
                <Space
                    direction="vertical"
                    className="w-full"
                >
                    <TextArea
                        rows={4}
                        placeholder="Nội dung..."
                        onChange={props.onChangeInput}
                        value={props.currentVal.task}
                    />
                    <Space
                        direction="vertical"
                    >
                        <label>Ngày bắt đầu</label>
                        <DatePicker
                            format="YYYY-MM-DD"
                            onChange={props.timeStart}
                            value={props.currentVal.start ? props.currentVal.start : null}
                        />
                    </Space>
                    <Space
                        direction="vertical"
                    >
                        <label>Ngày kết thúc</label>
                        <DatePicker
                            format="YYYY-MM-DD"
                            onChange={props.timeEnd}
                            value={props.currentVal.end ? props.currentVal.end : null}
                        />
                    </Space>
                    <p className="text-red-600">{props.noticeError}</p>
                </Space>
            </Modal>
        </>
    );
}

