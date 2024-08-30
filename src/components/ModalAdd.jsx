import React, {useState, useEffect} from "react";
import {
    Input,
    DatePicker,
    Space
} from 'antd';
import {
    Modal,
} from "antd";
import dayjs from "dayjs";

const { TextArea } = Input;

export const ModalAddElement = ({ hideAdd, addNewTask, open, ...props }) => {
    const [currentVal, setCurrentVal] = useState(props.currentVal);
    
    useEffect(() => {
        console.log('props.currentVal:', props.currentVal);
        setCurrentVal(props.currentVal);
    }, [props.currentVal]);
    
    console.log('currentVal:', currentVal);
    return (
        <>
            <Modal
                title="Add todo"
                open={open}
                onOk={addNewTask}
                onCancel={hideAdd}
                okText={!(Object.keys(currentVal).length === 0) ? 'Edit' : 'Add'}
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
                        defaultValue={currentVal.task !== '' ? currentVal.task : ''}
                    />
                    <Space
                        direction="vertical"
                    >
                        <label>Ngày bắt đầu</label>
                        <DatePicker
                            format="YYYY-MM-DD"
                            onChange={props.timeStart}
                            defaultValue={currentVal.start ? dayjs(currentVal.start) : null}
                        />
                    </Space>
                    <Space
                        direction="vertical"
                    >
                        <label>Ngày kết thúc</label>
                        <DatePicker
                            format="YYYY-MM-DD"
                            onChange={props.timeEnd}
                            defaultValue={currentVal.end ? dayjs(currentVal.end) : null}
                        />
                    </Space>
                </Space>
            </Modal>
        </>
    );
}

