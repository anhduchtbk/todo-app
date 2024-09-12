import React,
{ useState, useEffect } from 'react';
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
  const defaultE = {
    key: -1,
    task: '',
    start: null,
    end: null,
    status: '',
    isComplete: false
  }
  const [addTodo, setAddTodo] = useState(false);
  const [listTask, setListTask] = useState([]);
  const [timePicked, setTimePicked] = useState({
    start: null,
    end: null,
  });
  const [inputTask, setInputTask] = useState('');
  const [currentValE, setCurrentValE] = useState(defaultE);
  const [complete, setComplete] = useState(false);
  const [status, setStatus] = useState('');
  const [noticeError, setNoticeError] = useState('');

  const [api, contextHolder] = notification.useNotification();
  const openNotification = (placement) => {
    api.info({
      message: `Notification ${placement}`,
      description: <Context.Consumer>{({ name }) => `Thông tin cần nhập đầy đủ và chính xác`}</Context.Consumer>,
      placement,
    });
  };

  const [searchInput, setSearchInput] = useState('');

  const [keyRowSelected, setKeyRowSelected] = useState([]);

  const handleSearchInput = (e) => {
    setSearchInput(e.target.value);
  }

  const handleRowSelected = (rowsSelected) => {
    setKeyRowSelected(rowsSelected);
  }


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
    setCurrentValE(defaultE);
    setAddTodo(true);
  }

  const handleAcceptEdit = () => {
    const updatedList = listTask.map(item => {
      if (item.key === currentValE.key) {
        return {
          ...item,
          task: currentValE.task,
          start: currentValE.start,
          end: currentValE.end,
          status: currentValE.status,
          isComplete: currentValE.isComplete
        }
      }
      return item;
    });
    setListTask(updatedList);
    setAddTodo(false);
  }

  const handleEditTodo = (key, r) => {
    setAddTodo(true);
    setCurrentValE(r);
  }

  const handleCancelTodo = () => {
    setCurrentValE(defaultE);
    setAddTodo(false);
  }

  const handleTimeStart = (d, dateString) => {
    // setTimePicked(currentTime => ({ ...currentTime, start: d }));
    setCurrentValE(cur => ({
      ...cur,
      start: d
    }))
  }

  const handleTimeEnd = (d, dateString) => {
    // setTimePicked(currentTime => ({ ...currentTime, end: d }));
    setCurrentValE(cur => ({
      ...cur,
      end: d
    }))
  }

  const handleChangeInput = (e) => {
    // setInputTask(e.target.value);
    setCurrentValE(cur => ({
      ...cur,
      task: e.target.value
    }))
  }

  const handleDeleteTask = (key) => {
    const newData = listTask.filter((item) => item.key !== key);
    setListTask(newData);
  };

  const handleAddNewTask = () => {
    // const formData = {
    //   key: listTask.length + 1,
    //   task: inputTask,
    //   start: timePicked.start,
    //   end: timePicked.end,
    //   status: status,
    //   isComplete: complete
    // };

    const formData = {
      key: listTask.length + 1,
      task: currentValE.task,
      start: currentValE.start,
      end: currentValE.end,
      status: status,
      isComplete: complete
    };

    const realTime = getRealTime()

    if (!formData.start || !formData.end || !formData.task || Date.parse(formData.start) > Date.parse(formData.end)) {
      // openNotification('topRight');
      setNoticeError('Thông tin cần nhập đầy đủ và chính xác');
    } else {
      setNoticeError('');
      if (Date.parse(formData.start) < Date.parse(realTime)) {
        formData.status = STATUS.todo;
        setStatus(STATUS.todo);
        setAddTodo(false);
        setListTask(currentListTask => [...currentListTask, formData]);

      } else if (Date.parse(formData.end) < Date.parse(realTime)) {
        formData.status = STATUS.overdue;
        setStatus(STATUS.overdue);
        setAddTodo(false);
        setListTask(currentListTask => [...currentListTask, formData]);
      } else if (Date.parse(formData.start) > Date.parse(realTime) && Date.parse(formData.end) > Date.parse(realTime)) {
        formData.status = STATUS.inProgress;
        setStatus(STATUS.inProgress);
        setAddTodo(false);
        setListTask(currentListTask => [...currentListTask, formData]);
      }
    }
  }

  useEffect(() => {
    const updatedList = listTask.map(item => {
      keyRowSelected.forEach(update => {
        if (item.key === update) {
          item.status = STATUS.complete;
          item.isComplete = true;
        }
      });
      return item;
    });
    setListTask(updatedList)

    // setCurrentValE(cur => ({
    //   ...cur,
    //   task: inputTask,
    //   start: timePicked.start,
    //   end: timePicked.end,
    //   status: status,
    //   isComplete: complete
    // }))

    // }, [inputTask, timePicked, status, complete, keyRowSelected])
  }, [keyRowSelected])

  return (
    // <Context.Provider value={contextValue}>
    //   {contextHolder}
    <div
      className='w-full h-full text-center p-10'
    >
      <ModalAddElement
        open={addTodo}
        hideAdd={handleCancelTodo}
        editTask={handleAcceptEdit}
        timeStart={handleTimeStart}
        timeEnd={handleTimeEnd}
        onChangeInput={handleChangeInput}
        addNewTask={() => {
          handleAddNewTask();
        }}
        currentVal={currentValE}
        noticeError={noticeError}
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
          onChange={handleSearchInput}
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
          onChangeRowSelected={handleRowSelected}
          handleDelete={handleDeleteTask}
          filterInput={searchInput}
        />
      </div>
    </div>
    // </Context.Provider>
  );
}

export default App;
