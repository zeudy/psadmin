"use strict";

var React = require('react');
var Router = require('react-router');
var AuthorForm = require('./authorForm');
var AuthorApi = require('../../api/authorApi');
var toastr = require('toastr');

var ManageAuthorPage = React.createClass({
        mixins: [
            Router.Navigation
        ],

        statics: {
            willTransitionFrom: function(transition, component) {
                if (component.state.dirty && !confirm('Leave without saving?')){
                    transition.abort();
                }
            }
        },
    
    getInitialState: function() {
        return {
            Author: { id: '', firstName: '', lastName: ''},
            errors: {},
            dirty: false
        };
    },

    componentWillMount: function(){
        var authorId = this.props.params.id; //from the path'/author:id'
    if (authorId){
        this.setState({author: AuthorApi.getAuthorById(authorId)});
    }
    },
    
    setAuthorState: function(event){ 
        this.setState({dirty: true}); 
        var field = event.target.name;
        var value = event.target.value;
        this.state.Author[field] = value;
        return this.setState({Author: this.state.Author});
    },

    authorFormIsValid: function() {
        var formIsValid = true;
        this.state.errors = {}; // clear any previous errors.

        if (this.state.Author.firstName.length < 3){
            this.state.errors.firstName = 'First name must be at least 3 characters.';
            formIsValid = false;
        }
        if (this.state.Author.lastName.length < 3){
            this.state.errors.lastName = 'Last name must be at least 3 characters.';
            formIsValid = false;
        }
        this.setState({errors: this.state.errors});
            return formIsValid;
        },


    saveAuthor: function(event){
        event.preventDefault();

        if (!this.authorFormIsValid()){
            return;
        }
        AuthorApi.saveAuthor(this.state.Author);
        this.setState({dirty: false}); 
        toastr.success('FIXTER.');
        this.transitionTo('authors');
    },

    render: function() {
        return (
          
            <AuthorForm
             author={this.state.Author} 
             onChange={this.setAuthorState}      
            onSave={this.saveAuthor}
            errors={this.state.errors} />
);
    }
});

module.exports = ManageAuthorPage;
