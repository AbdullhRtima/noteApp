import React ,{useState ,useEffect} from 'react';
import axios from 'axios';
import api from '../../ Utilities/api';
import Cookie from "js-cookie";
import Moment from 'react-moment';
import CookieConsent from 'react-cookie-consent';
import Typist from 'react-typist';

//img

import dr from './dr.jpg';
import Logo from './paper.png';

// ui 

import {
     Button,
     Card,
     Modal ,
     Icon ,
     Header,
     Dimmer,
     Loader, 
     Image, 
     Segment, 
     Grid,
     Form,
     Message,
   } from 'semantic-ui-react'

import {useForm } from 'react-hook-form';
import "./style.scss"

const DeleteModal = (props) => (
    <Modal trigger={<Button basic color='red'>Delete</Button>} basic size='small'>
      <Header icon='archive' content='Delete note'/>
      <Modal.Content>
        <p>
           are you sure this will be deleted 
        </p>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={()=>props.deleteNote(props.id)} color='green' inverted>
          <Icon name='checkmark'/> Yes
        </Button>
      </Modal.Actions>
    </Modal>
  )
const AddNoteModal=(props)=>(    
      <Modal open={props.addModal} >
          <Modal.Header>Add Note</Modal.Header>
          <Modal.Content>

        <Grid textAlign="center" verticalAlign="middle">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Form onSubmit={ props.handleSubmit(props.onSubmit)} size="large">
              <Form.Input
                fluid
                name="text"
                icon="pencil alternate"
                iconPosition="left"
                placeholder="note description"
                type="text"
                onChange={async (e, { name, value }) => {
                   props.setValue(name, value);
                    await props.triggerValidation({ name })
                  }}
                  className={props.handleInputError(props.errors)}
              />
              {props.errors.text && "description is required"}
              <Form.Input
                fluid
                name="tage"
                icon="tags"
                iconPosition="left"
                placeholder="tags"
                type="text"
                onChange={async (e, { name, value }) => {
                    props.setValue(name, value);
                    await props.triggerValidation({ name })
                  }}
                className={props.handleInputError(props.errors)}
              />
              {props.errors.tag && 'tags is required'}
              <Modal.Actions>
              <Button type="submit" color='green'>
                  Add
                </Button>
                <Button onClick={props.closeAddModal} color='red'>
                  Close
                </Button>
              </Modal.Actions>
          </Form>
        </Grid.Column>
       </Grid>

          </Modal.Content>
       
        </Modal>
)

const EditNoteModal=(props)=>(    
    <Modal open={props.editModal} >
        <Modal.Header> Edit Note</Modal.Header>
        <Modal.Content>
        <Grid textAlign="center" verticalAlign="middle">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Form onSubmit={ props.handleSubmit(props.editOnSubmit)} size="large">
              <Form.Input
                fluid
                name="text"
                icon="pencil alternate"
                iconPosition="left"
                placeholder="note description"
                type="text"
                defaultValue={props.note.text}
                onChange={async (e, { name, value }) => {
                    props.setValue(name, value );
                    await props.triggerValidation({ name })
                  }}
                //  value={props.note.text}
                  className={props.handleInputError(props.errors)}
              />
              {/* <h1>{props.note.text}</h1> */}
           {props.errors.text && "description is required"}
              <Form.Input
                fluid
                name="tage"
                icon="tags"
                iconPosition="left"
                placeholder="tags"
                type="text"
                defaultValue={props.note.tage}
                onChange={async (e, { name, value }) => {
                    props.setValue(name,value);
                    await props.triggerValidation({ name })
                  }}
                  //  value={props.note.tage}
                className={props.handleInputError(props.errors)}
              />
              {props.errors.tag && 'tags is required'}
              <Modal.Actions>
              <Button type="submit" color='green'>
                  Edit
                </Button>
                <Button onClick={props.closeEditModal} color='red'>
                  Close
                </Button>
              </Modal.Actions>
          </Form>
        </Grid.Column>
       </Grid>
        </Modal.Content>
      </Modal>
)
  const Spinner = () => (
    <Dimmer active>
    <Loader size="huge" content={"Loading notes..."} />
  </Dimmer>
  )

function List(props) {
    const { register, errors, handleSubmit, setValue, triggerValidation ,defaultValues} = useForm();
    //state
    const [data , setData] = useState([]);
    const [singleNote ,setNote] = useState([]);
    const [isLoading ,setLoading] = useState(false);
    const [error ,setError ] = useState([]);
    const [addModal , setAddModal] = useState(false);
    const [editModal , setEditModal] = useState(false);

    // functions 
        const onSubmit = async (note) => {
           //console.log(note)
            try{
                const USER_TOKEN = Cookie.get('token')
                const AuthStr = 'Bearer '.concat(USER_TOKEN);
                setLoading(true);
                await axios.post(api("notes") ,note, { headers: { Authorization: AuthStr } });
                window.location.reload();
                setLoading(false); 
            }catch(err){
                setError(err.message)
                setLoading(false);
            }
        }

        const handleInputError = (errors, inputName) => {
            if(props.errors) {
              return "error"
            }else {
              return ""
            }
          }
          
        useEffect(() => {
          register({ name: "text"}, {
            required: true});
          register({ name: "tage"}, 
          {required: true});
        }, []);
      
    // fetch notes after auth 
    useEffect(()=>{
        const fetchNotes = async()=> {
        try{
            const USER_TOKEN = Cookie.get('token')
            const AuthStr = 'Bearer '.concat(USER_TOKEN);
            setLoading(true)
            const res = await axios.get(api("notes"), { headers: { Authorization: AuthStr } });
            setData(res.data.data)
            setLoading(false);
            console.log(res.data.data)
        }catch(err){
            setError(err)
            setLoading(false)
        }}
        fetchNotes();
        },[]);

        const toggleAddModal =()=> {
               setAddModal(true);
          }
        const closeAddModal =()=> {
            setAddModal(false);
         }

        const fetchSingleNote = async(id)=> {
          const USER_TOKEN = Cookie.get('token');
          const AuthStr = 'Bearer '.concat(USER_TOKEN);
          setLoading(true);
          const res = await axios.get(api(`notes/${id}`), { headers: { Authorization: AuthStr } });
          setNote(res.data);
          setLoading(false);
          console.log("single note",res.data)
        
        }
        const toggleEditModal =(id)=> {
            setEditModal(true);
            fetchSingleNote(id);
       }
        const closeEditModal =()=> {
            setEditModal(false);
        }
        const deleteNote =async(id)=> {
            const USER_TOKEN = Cookie.get('token')
            const AuthStr = 'Bearer '.concat(USER_TOKEN);
            const filterNote = data.filter((note ,i)=> note._id !== id  )
            setData(filterNote)
            await axios.delete(api(`notes/${id}`),{ headers: { Authorization: AuthStr } })
          //  console.log(id)
            // window.location.reload();
        }

        const editOnSubmit = async (id,newnote) => {
          console.log(newnote)
           try{
               const USER_TOKEN = Cookie.get('token')
               const AuthStr = 'Bearer '.concat(USER_TOKEN);
               setLoading(true);
               await axios.patch(api(`notes/${id}`),newnote, { headers: { Authorization: AuthStr}});
               window.location.reload();
               setLoading(false); 
           }catch(err){
               setError(err.message)
               setLoading(false);
           }
       }

    return (
        <div className="list"> 
        <CookieConsent>
           This website uses cookies to enhance the user experience.
        </CookieConsent>
         <nav className="nav">
            <img className="logo" alt="logo" src={Logo}/>
            <p className="quote" >
                <img className="dr-img" alt="dr" src={dr}/>
                <Typist count={8} delay={20}>
                   “How did it get so late so soon? ― Dr. Seuss
                </Typist>
                </p>
            <div className="control-nav">
            <Button onClick={toggleAddModal} className="btn-nav" color="yellow">Add</Button>
              { addModal && 
              <AddNoteModal 
                errors={error}
                triggerValidation={triggerValidation}
                handleInputError={handleInputError}
                setValue={setValue}
                defaultValues={defaultValues}
                onSubmit={onSubmit}
                handleSubmit={handleSubmit}
                addModal={addModal}
                closeAddModal={closeAddModal}
               />}
               <Button className="btn-nav" onClick={props.logout}> logout</Button>
            </div>
          
        </nav>
        
            <section className="cards">
                {
                    isLoading ?  <Spinner/> :    
                    <Card.Group>
                       { data.map ((note,i) => {
                        return(
                            <Card key={note._id}>
                                <Card.Content>
                                <Card.Header>Todo</Card.Header>
                                    <Card.Meta>
                                    <Moment format="YYYY/MM/DD">
                                        {note.createdAt}
                                        </Moment>  
                                        </Card.Meta>
                                <Card.Description>
                                    <strong>{note.text}</strong>
                                </Card.Description>
                                <Card.Meta>{note.tage}</Card.Meta>
                                </Card.Content>
                                <Card.Content extra>
                                <div className='ui two buttons'>
                                    <Button onClick={ ()=>toggleEditModal(note._id)} basic color='green'>
                                        Edit 
                                    </Button>
                                    { editModal && 
                                        <EditNoteModal 
                                         note={singleNote}
                                         triggerValidation={triggerValidation}
                                         handleInputError={handleInputError}
                                         setValue={setValue}
                                         editOnSubmit={editOnSubmit}
                                         handleSubmit={handleSubmit}
                                         errors={error}
                                         editModal={editModal}
                                         closeEditModal={closeEditModal}
                                        />
                                      }

                                    <DeleteModal
                                     deleteNote={deleteNote} 
                                     id={note._id}/>
                                </div>
                                </Card.Content>
                            </Card>
                        )
                    }
                )
            }      
            </Card.Group>
                }
           
            </section>               
        </div>
        
    )
}
export default List ;