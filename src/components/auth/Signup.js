import React,{useEffect} from 'react';
import {
    Grid,
    Form,
    Segment,
    Button,
    Header,
    Message,
    Icon
  } from "semantic-ui-react";
import {useForm} from 'react-hook-form';
import {Link} from 'react-router-dom';

const Signup=(props)=> {

const { register, errors, handleSubmit, setValue, triggerValidation } = useForm();

const onSubmit = data => {
     props.signupSubmit(data)
}

const signup = props.errors ;
console.log("error signup",signup);

const handleInputError = (errors, inputName) => {
  if(props.errors) {
    return "error"
  }else {
    return ""
  }
}

useEffect(() => {
        register({ name: "email" }, { required: true });
        register({ name: "password" }, { required: true });
      }, []);
  
    return (
        <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h1" icon color="yellow" textAlign="center">
            <Icon name="signup" color="yellow" />
                Signup to Note app 
          </Header>
          <Form  onSubmit={handleSubmit(onSubmit)}  size="large">
            <Segment stacked>
              <Form.Input
                fluid
                name="email"
                icon="mail"
                iconPosition="left"
                placeholder="Email Address"
                type="email"
                onChange={async (e, { name, value }) => {
                    setValue(name, value);
                    await triggerValidation({ name })
                  }}
                className={handleInputError(props.errors) }
              />
                {errors.email && "Email is required"}
              <Form.Input
                fluid
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                type="password"
                onChange={async (e, { name, value }) => {
                    setValue(name, value);
                    await triggerValidation({ name })
                  }}
                className={handleInputError(props.errors) }
              />
                {errors.password && 'password is required'}
              <Button
                disabled={props.loading}
                className={props.loading ? "loading" : ""}
                color="yellow"
                fluid
                size="large"
              >
                Submit
              </Button>

            {props.errors  && (
                <Message error>
                  <h3>Error</h3>
                  {props.errors}
                </Message>
               )}
            </Segment>
          </Form>
          <Message  >
             I alreday have an account <Link to="/">  Login </Link>
          </Message>
        </Grid.Column>
      </Grid>
    )
}
export default Signup;