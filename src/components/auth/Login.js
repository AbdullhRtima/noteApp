import React ,{ useState ,useEffect} from 'react';
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

const Login=(props)=> {

const { register, errors, handleSubmit, setValue, triggerValidation } = useForm();

// functions 
const onSubmit = data => {
    props.loginSubmit(data)
}
// const displayErrors = errors =>
// props.errors.map((error, i) => <p key={i}>{error.message}</p>);

const loginError = props.errors ;
console.log("error login",loginError);

const handleInputError = (errors, inputName) => {
  if(props.errors) {
    return "error"
  }else {
    return ""
  }
}

useEffect(() => {
    register({ name: "email" }, {
      required: true});
    register({ name: "password" }, 
    {required: true});
  }, []);

    return (
        <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h1" icon color="yellow" textAlign="center">
            <Icon name="sticky note outline" color="yellow" />
                Login to Note app 
           </Header>
          <Form onSubmit={handleSubmit(onSubmit)} size="large">
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
                  className={handleInputError(errors)}
              />
             {/* {errors.email && errors.email.message} */}
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
                className={handleInputError(errors)}
              />
              {errors.password && 'password is required'}
              <Button
                disabled={props.loading}
                className={props.loading ? "loading" : ""}
                color="yellow"
                fluid
                size="large"
                type="submit">
                Submit
              </Button> 
            </Segment>
          </Form>
          {props.errors  && (
            <Message error>
              <h3>Error</h3>
              {props.errors}
            </Message>
          )}
          <Message>
            Don't have an account? <Link to="/signup">signup now</Link>
          </Message>
        </Grid.Column>
      </Grid>
    )
}
export default Login;