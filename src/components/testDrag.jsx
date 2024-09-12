/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Table,
  Tag,
  Space,
  Popconfirm
} from 'antd';

const Row = (props) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: props['data-row-key'],
  });
  const style = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    cursor: 'move',
    ...(isDragging
      ? {
        position: 'relative',
        zIndex: 9990,
      }
      : {}),
  };
  return <tr {...props} ref={setNodeRef} style={style} {...attributes} {...listeners} />;
};
export const DragE = (props) => {
  const [dataSource, setDataSource] = useState(props.listTask);

  const handleDelete = (key) => {
    // const newData = dataSource.filter((item) => item.key !== key);
    // setDataSource(newData);
    props.handleDelete(key)
  };

  const columns = [
    {
      title: 'Task',
      dataIndex: 'task',
      showSorterTooltip: {
        target: 'full-header',
      },
      // here is that finding the name started with `value`
      sorter: (a, b) => a.task.length - b.task.length,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (text) => <Tag color="geekblue">{text}</Tag>
    },
    {
      title: 'Time Start',
      dataIndex: 'start',
      defaultSortOrder: 'descend',
      render: (a) => a.format('YYYY-MM-DD'),
      sorter: (a, b) => Date.parse(a.start) - Date.parse(b.start),
    },
    {
      title: 'Time End',
      dataIndex: 'end',
      render: (a) => a.format('YYYY-MM-DD'),
      sorter: (a, b) => Date.parse(a.end) - Date.parse(b.end),
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      fixed: 'right',
      width: 150,
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <Space>
            <a onClick={() => handleDelete(record.key)} className='text-teal-300'>Delete</a>
            <a onClick={() => props.editTodo(record.key, record)} className='text-teal-300'>Edit</a>
            {
              record.isComplete
                ? <></>
                : <Popconfirm title="Sure to complete this task?" onConfirm={() => props.onChangeRowSelected([record.key])}>
                  <a className='text-teal-300'>Complete</a>
                </Popconfirm>
            }

          </Space>
        ) : null,
    },
  ];

  useEffect(() => {
    setDataSource(props.listTask.filter(item => item.task.includes(props.filterInput || '')))
  }, [props.listTask, props.filterInput])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        // https://docs.dndkit.com/api-documentation/sensors/pointer#activation-constraints
        distance: 1,
      },
    }),
  );
  const onDragEnd = ({ active, over }) => {
    if (active.id !== over?.id) {
      setDataSource((prev) => {
        const activeIndex = prev.findIndex((i) => i.key === active.id);
        const overIndex = prev.findIndex((i) => i.key === over?.id);
        return arrayMove(prev, activeIndex, overIndex);
      });
    }
  };

  const rowSelection = {
    onChange: (selectedRowKeys, _) => {
      props.onChangeRowSelected(selectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      // Column configuration not to be checked
      name: record.name,
    }),
  }
  return (
    <DndContext sensors={sensors} modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
      <SortableContext
        // rowKey array
        items={dataSource
          .map((i) => {
            return i.key;
          })}
        strategy={verticalListSortingStrategy}
      >
        <Table
          // rowSelection={{
          //   ...rowSelection,
          // }}
          components={{
            body: {
              row: Row,
            },
          }}
          rowKey="key"
          columns={columns}
          dataSource={dataSource}
        />
      </SortableContext>
    </DndContext>
  );
};