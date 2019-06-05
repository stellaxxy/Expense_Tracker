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
    constructor(id, date, type, vendor, city, state, amount, currency, paymentMethod, comment){
        this.data = {
            id, date, type, vendor, city, state, amount: parseFloat(amount).toFixed(2), currency, paymentMethod, comment
        };
        this.domElements = {
            row: null,
            checkbox: null,
            date: null,
            type: null,
            amount: null,
            comment: null,
            operations: null,
        };
        this.handleDelete = this.handleDelete.bind( this );
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

        var amountColumn = $('<td>');
        var topAmount = $('<span>').text(this.data.amount).addClass('topCell');
        var bottomAmount = $('<span>').text(this.data.currency).addClass('bottomCell');
        amountColumn.append(topAmount,bottomAmount);

        var checkboxInput = $('<input>').attr({
            type: 'checkbox',
            name: 'selectedItems',
            value: this.data.id
        }).addClass('checkbox');
        var checkboxColumn = $('<td>').append(checkboxInput);

        if($(window).width() <= 576){
            var detailColumn = $('<td>');
            var detailType = $('<span>').text(this.data.type).addClass('topCell smallDetailType');
            var detailDate = $('<span>').text(this.data.date).addClass('topCell smallDetailDate');
            var detailLocation = $('<span>').text(`${this.data.vendor}, ${this.data.city}, ${this.data.state}`).addClass('topCell smallDetailLocation');
            var detailComment = $('<span>').text(this.data.comment).addClass('bottomCell');
            detailColumn.append(detailType, detailDate, detailLocation, detailComment);

            row.append(checkboxColumn, detailColumn, amountColumn);
        } else {
            var dateColumn = $('<td>').text(this.data.date);
            var typeColumn = $('<td>');
            var topType = $('<span>').text(this.data.type).addClass('topCell');
            var bottomType = $('<span>').text(`${this.data.vendor}, ${this.data.city}, ${this.data.state}`).addClass('bottomCell');
            typeColumn.append(topType, bottomType);
            var commentColumn = $('<td>').text(this.data.comment);


            this.domElements.checkbox = checkboxColumn;
            this.domElements.date = dateColumn;
            this.domElements.type = typeColumn;
            this.domElements.amount = amountColumn;
            this.domElements.comment = commentColumn;

            row.append(checkboxColumn, dateColumn, typeColumn, amountColumn, commentColumn);
        }

        this.domElements.row = row;

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