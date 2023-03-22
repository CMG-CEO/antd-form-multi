import React, { Component } from 'react';
import { Form } from 'antd';
class WForm extends Component {
  formRef = this.props.forwardedref;
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { initialValues, ...setting } = this.props;
    return (
      <Form
        initialValues={initialValues}
        ref={this.formRef}
        onFinish={this.props.onFinish}
        labelWrap
        layout="horizontal"
        style={{ marginLeft: 0, marginRight: 0, width: '100%' }}
        {...setting}
      >
        {this.props.children}
      </Form>
    );
  }
}

export default React.forwardRef((props, ref) => {
  return <WForm {...props} forwardedref={ref} />;
});
