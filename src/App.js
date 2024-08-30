import React,
{ useState, useMemo } from 'react';
import './App.css';
import {
  Input,
  Button,
  Space,
  Divider,
  notification
} from 'antd';
import { PlusSquareOutlined } from '@ant-design/icons';

import { ModalAddElement } from './components/ModalAdd';
import { DragE } from './components/testDrag';

const { Search } = Input;

const Context = React.createContext({
  name: 'Default',
});

function App() {
  const [addTodo, setAddTodo] = useState(false);
  const [listTask, setListTask] = useState([]);
  const [timePicked, setTimePicked] = useState({
    start: '',
    end: '',
  });
  const [inputTask, setInputTask] = useState('');
  const [currentValE, setCurrentValE] = useState({
    key: -1,
    task: '',
    start: '',
    end: '',
    status: '',
    isComplete: false
  });

  const [api, contextHolder] = notification.useNotification();
  const openNotification = (placement) => {
    api.info({
      message: `Notification ${placement}`,
      description: <Context.Consumer>{({ name }) => `Thông tin cần nhập đầy đủ và chính xác`}</Context.Consumer>,
      placement,
    });
  };
  const contextValue = useMemo(
    () => ({
    }),
    [],
  );

  const getRealTime = () => {
    var today = new Date();
    var dd = today.getDate();

    var mm = today.getMonth() + 1;

    var yyyy = today.getFullYear();
    return yyyy + '-' + mm + '-' + dd;
  }

  const STATUS = {
    todo: 'TODO',
    inProgress: 'INPROGRESS',
    complete: 'COMPLETE',
    overdue: 'OVERDUE'
  }

  const handleAddTodo = () => {
    setCurrentValE({});
    setAddTodo(true);
  }

  const handleEditTodo = (key, r) => {
    setAddTodo(true);
    setCurrentValE(r);
  }

  const handleCancelTodo = () => {
    setCurrentValE({});
    setAddTodo(false);
  }

  const handleTimeStart = (_, dateString) => {
    setTimePicked(currentTime => ({ ...currentTime, start: dateString }));
  }

  const handleTimeEnd = (_, dateString) => {
    setTimePicked(currentTime => ({ ...currentTime, end: dateString }));
  }

  const handleChangeInput = (e) => {
    setInputTask(e.target.value);
  }

  const handleAddNewTask = () => {
    const formData = {
      key: listTask.length + 1,
      task: inputTask,
      start: timePicked.start,
      end: timePicked.end,
      status: '',
      isComplete: false
    };

    const realTime = getRealTime()

    if (!formData.start || !formData.end || !formData.task || Date.parse(formData.start) > Date.parse(formData.end)) {
      openNotification('topRight');
    } else {
      if (Date.parse(formData.start) < Date.parse(realTime)) {
        formData.status = STATUS.todo;

      } else if (Date.parse(formData.start) > Date.parse(realTime) && Date.parse(formData.end) > Date.parse(realTime)) {
        formData.status = STATUS.inProgress;
      }
      setAddTodo(false);
      setListTask(currentListTask => [...currentListTask, formData]);
    }
  }

  return (
    <Context.Provider value={contextValue}>
      {contextHolder}
      <div
        className='w-full h-full text-center p-10'
      >
        <ModalAddElement
          open={addTodo}
          hideAdd={handleCancelTodo}
          timeStart={handleTimeStart}
          timeEnd={handleTimeEnd}
          onChangeInput={handleChangeInput}
          addNewTask={() => {
            handleAddNewTask();
          }}
          currentVal={currentValE}
        />

        <h1
          className='text-3xl font-bold'
        >
          ToDo List
        </h1>
        <Space
          className='p-10 w-[100%] flex justify-center'
        >
          <Search
            placeholder='Nhập...'
            className='w-fill'
          />

          <Button
            type="primary" icon={<PlusSquareOutlined />} iconPosition={'end'}
            onClick={() => {
              handleAddTodo()
            }}
          >
            Add
          </Button>
        </Space>

        <Divider plain>Task</Divider>
        <div>
          <DragE
            listTask={listTask}
            editTodo={handleEditTodo}
          />
        </div>
      </div>
    </Context.Provider>
  );
}

export default App;
