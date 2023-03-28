export const formItemLayoutHandle = (labelCol, wrapperCol, offset) => {
  return {
    labelCol: {
      sm: { span: labelCol || 6 },
    },
    wrapperCol: {
      sm: { span: wrapperCol || 18 },
      offset,
    },
  };
};
