class ExpenseList{
    /* constructor - take in params for the student and save them,
        create storage for student dom elements
        store the deletion callback from the model
        bind event handlers
    params:
        (number) id - the id of this student
        (string) name - the name of the student
        (string) course - the course of the student
        (number) grade - the grade of the student
        (function) deleteCallback - the removal function from the model to call when this student wants to be removed from the model's list
    return: undefined (don't return undefined, it will screw it up a constructor, don't put a return)
    */
    /*
    this function has been written for you to see best practices and proper
    compartmentalization of data, as well as correct binding.  It also
    uses a default parameter on the deleteCallback function, but don't worry about that
    for your version
    You do not need to modify any more of THIS constructor, but other constructors
    will not be built out.
    Please make sure you understand what is going on and could recreate it via notes rather than direct copying!
    */
    constructor(id, date, type, vendor, city, state, amount, currency, paymentMethod, comment, deleteCallback=()=>{}){
        this.data = {
            id, date, type, vendor, city, state, amount: parseFloat(amount).toFixed(2), currency, paymentMethod, comment
        };
        this.deleteCallback = deleteCallback;
        this.domElements = {
            row: null,
            date: null,
            type: null,
            amount: null,
            comment: null,
            operations: null,
            deleteButton: null
        };
        this.handleDelete = this.handleDelete.bind( this );
    }
    /* update - change a value in the student record
    purpose: ensure that the field is one that can be changed (either id, name, course, or grade)
        if not changable, return false
        otherwise update the value
            save the value into the properties stored in the constructor
            go to the dom element of the appropriate field and change the text
                (for example, if name was changed, go to the student's name TD and change the name as well)
            and return true
    params:
        (string) field - the field in the object to change
        (multiple) value - the value to change the field to
    return: (boolean) true if it was changed, false if it was not
    */
    update(field, value){

        if(field === 'id' || field === 'date' || field === 'type' || field === 'amount' || field === 'comment'){
            this.data[field]= value;
            $(this.domElements[field]).text(value);
            return true;
        } else {
            return false;
        }
    }
    /* getData - get all the student data as a simple object
    params: none
    return: (object) an object with the following data
        (number): id
        (string): name
        (string): course
        (number): grade
    */
    getData(){
        var studentData = {
            id: this.data.id,
            name: this.data.name,
            course: this.data.course,
            grade: this.data.grade
        };
        return studentData;
    }
    /* render - create and return a table row (TR) with 4 table cells (TD) in them:
        name : the student's name
        course : the student's course
        grade: the student's grade
        operations: holds any buttons for the student - will hold a delete button
    purpose:
        create the TR and 4 TDs,
        put the 4 TDs inside the TR.
        Add the button to the operation TD
        add the ExpenseList's handleDelete method to the delete button's click handler
        store all these values for eventual change
        return the TR
    params: none
    return: (jquery dom element) the row that contains the student dom elements
    */
    render() {
        var row = $('<tr>');
        var dateColumn = $('<td>').text(this.data.date);
        var typeColumn = $('<td>');
        var topType = $('<span>').text(this.data.type).addClass('topCell');
        var bottomType = $('<span>').text(`${this.data.vendor}, ${this.data.city}, ${this.data.state}`).addClass('bottomCell');
        typeColumn.append(topType, bottomType);
        var amountColumn = $('<td>');
        var topAmount = $('<span>').text(this.data.amount).addClass('topCell');
        var bottomAmount = $('<span>').text(this.data.currency).addClass('bottomCell');
        amountColumn.append(topAmount,bottomAmount);
        var commentColumn = $('<td>').text(this.data.comment);
        var operationColumn = $('<td>');
        var deleteButton = $('<button>').text('delete').css('background-color', 'red');

        this.domElements.row = row;
        this.domElements.date = dateColumn;
        this.domElements.type = typeColumn;
        this.domElements.amount = amountColumn;
        this.domElements.comment = commentColumn;
        this.domElements.operations = operationColumn;
        this.domElements.deleteButton = deleteButton;

        operationColumn.append(deleteButton);
        row.append(dateColumn, typeColumn, amountColumn, commentColumn, operationColumn);

        deleteButton.click(this.handleDelete);
        return row;
    }
    /* handleDelete - call the model delete callback, and remove this student's dom element
    purpose:
        call the callback that was passed into the constructor by the model - give it this object's reference
        remove this object's dom element row to erase the entire dom element
    */
    handleDelete(){

        this.deleteCallback(this);

        return this.domElements.row.remove();


    }
}