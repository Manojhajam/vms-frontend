"use client"

import { useState } from "react"
import { Form, Input, Select, Button, Result } from "antd"

interface PreRegistrationFormData {
  full_name: string
  address: string
  phone: string
  citizenship_no: string
  purpose_of_visit: string
}

export default function PreRegistrationForm() {
  const [form] = Form.useForm<PreRegistrationFormData>()
  const [submitted, setSubmitted] = useState(false)
  const [submittedName, setSubmittedName] = useState("")

  const onFinish = async (values: PreRegistrationFormData) => {
    try{
        const response =await fetch("http://localhost:4000/visitors", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        })
        if (response.ok) {
          setSubmittedName(values.full_name)
          setSubmitted(true)
        } else {
          console.error("Failed to submit pre-registration")
        }
    }catch (error) {  
      console.error("Error submitting pre-registration", error)
  }
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg">
        <Result
          status="success"
          title="Pre-Registration Successful"
          subTitle={`Thank you, ${submittedName}. Your pre-registration has been submitted.`}
          extra={
            <Button
              type="primary"
              onClick={() => {
                form.resetFields()
                setSubmitted(false)
              }}
            >
              Register Another Visitor
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark="optional"
        size="large"
      >
        <Form.Item
          label="Full Name"
          name="full_name"
          rules={[{ required: true, message: "Please enter full name" }]}
        >
          <Input placeholder="Enter full name" />
        </Form.Item>

        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: "Please enter address" }]}
        >
          <Input.TextArea rows={3} placeholder="Enter address" />
        </Form.Item>

        <Form.Item
          label="Phone Number"
          name="phone"
          rules={[
            { required: true, message: "Please enter phone number" },
            { pattern: /^\d{10}$/, message: "Enter a valid 10-digit phone number" },
          ]}
        >
          <Input placeholder="Enter phone number" maxLength={10} />
        </Form.Item>

        <Form.Item
          label="Citizenship Number"
          name="citizenship_no"
          rules={[{ required: true, message: "Please enter citizenship number" }]}
        >
          <Input placeholder="Enter citizenship number" />
        </Form.Item>

        <Form.Item
          label="Purpose of Visit"
          name="purpose_of_visit"
          rules={[{ required: true, message: "Please select purpose of visit" }]}
        >
          <Select placeholder="Select purpose">
            <Select.Option value="business_meeting">Business Meeting</Select.Option>
            <Select.Option value="interview">Interview</Select.Option>
            <Select.Option value="delivery">Delivery</Select.Option>
            <Select.Option value="maintenance">Maintenance</Select.Option>
            <Select.Option value="official_visit">Official Visit</Select.Option>
            <Select.Option value="personal">Personal</Select.Option>
            <Select.Option value="other">Other</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Submit Pre-Registration
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
