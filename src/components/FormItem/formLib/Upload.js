import React from 'react';
import { Form, Button, Upload as UploadAnt } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
const Transfer = (props) => {
  let {
    upLevelname,
    type,
    code,
    label,
    required,
    pattern,
    validator,
    rules,
    width,
    range,
    // 以上
    onBlur,
    onChange,
    ...option
  } = props.item;
  const normFile = (e) => {
    if (e.fileList.length === 0) {
      return [];
    }
    return [e.file];
  };

  const downloadFile = (file) => {
    function fileDownload(url, filename) {
      getBlob(url, function (blob) {
        saveAs(blob, filename);
      });
    }
    function getBlob(url, cb) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'blob';
      xhr.onload = function () {
        if (xhr.status === 200) {
          cb(xhr.response);
        }
      };
      xhr.send();
    }
    function saveAs(blob, filename) {
      if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, filename);
      } else {
        var link = document.createElement('a');
        var body = document.querySelector('body');

        link.href = window.URL.createObjectURL(blob);
        link.download = filename;

        // fix Firefox
        link.style.display = 'none';
        body.appendChild(link);

        link.click();
        body.removeChild(link);

        window.URL.revokeObjectURL(link.href);
      }
    }
    if (file && file.url) {
      const tagA = document.createElement('a');

      tagA.setAttribute('href', 'javascript:void(0)');
      //   tagA.setAttribute('href', file.url);
      tagA.setAttribute('onclick', fileDownload(file.url, file.name));
      //   tagA.setAttribute('download', file.name);
      tagA.click();
    }
  };
  return (
    <Form.Item
      name={code}
      {...props.field}
      rules={[
        {
          required: !!required,
          message: '请选择' + label,
        },
      ]}
      noStyle
      valuePropName="fileList"
      getValueFromEvent={
        option.multiple
          ? ({ fileList }) => {
              return fileList;
            }
          : normFile
      }
    >
      <UploadAnt
        onPreview={(file) => downloadFile(file)}
        onRemove={() => true}
        listType={'text'}
        {...option}
      >
        <Button>
          <UploadOutlined />
          请选择
        </Button>
      </UploadAnt>
    </Form.Item>
  );
};

export default Transfer;
