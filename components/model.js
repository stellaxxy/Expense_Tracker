class Model{
    /* constructor - set up properties and binds for the model object
    params: none
    return: undefined (don't return undefined, that will screw it up)
    notes: store your records in an array that is a property of this object
    */
    constructor(displayExpense=()=>{}){
        this.dataArray = [];
        this.id = 0;
        this.displayExpenses = displayExpense;

        this.remove = this.remove.bind(this);
        this.handleGetData = this.handleGetData.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleUpdateClick = this.handleUpdateClick.bind(this);
        this.handleSearchClick = this.handleSearchClick.bind(this);
    }
    /* add - add a student to the model
    purpose:
        take in a name, course, and grade,
        generate an ID (this will be given later by the server, too)
        create new student record with id, name, course, grade, and a reference to the model's remove method
        add the newly made student to the model's list of students
    params:
        (string) name: the student's name
        (string) course: the student's course
        (number) grade: the student's grade
    return: (number) the current number of students in the list
    */
    add(id, date, type, vendor, city, state, amount, currency, paymentMethod, comment){
        //var id = this.getNextID();
        var expenseObject = new ExpenseList(id, date, type, vendor, city, state, amount, currency, paymentMethod, comment);
        this.dataArray.push(expenseObject);

        return this.dataArray.length;

    }

    getAllCheckedId(){
        const checkedValue = [];
        $('.checkbox:checked').each((index, element) => {
            const value = $(element).val();
            checkedValue.push(value);
        });
        return checkedValue;
    }

    handleDelete (){
        const checkedValue = this.getAllCheckedId();
        this.remove(checkedValue);
    }

    /* remove - called from the student object when the student is removing itself, so the model can also remove it from the list
    purpose - finds the given student in the model's list, and removes it
    params: (ExpenseList object) the student to remove
    return: (boolean) true if the student was removed, false if not
    */
    remove(idArr){
        var indexToDelete = [];
        var expenseToDelete = [];

        if(idArr.length === 0){
            return false;
        }
        idArr.map( id => {
            for(let index = 0; index < this.dataArray.length; index++){
                if(this.dataArray[index].data.id === id){
                    indexToDelete.push(index);
                    const deletedExpense = this.dataArray.splice(index, 1);
                    expenseToDelete.push(deletedExpense[0]);
                    break;
                }
            }
        });

        if(indexToDelete.length === 0){
            return false;
        }
        $('.errorMessage').show();

        $.ajax({
            url: 'http://localhost/expense_tracker/server/deleteExpense.php',
            method: 'POST',
            data: {expense_idArr: idArr},
            dataType: 'json',
            success: function(response){
                $('.errorMessage').hide();
                if(response.errors){
                    $('.loadingButton').hide();
                    $('.errorText').text(response.errors);
                    $('.errorMessage').show();

                    return false;
                } else {
                    expenseToDelete.map(item => {
                       item.domElements.row.remove();
                    });
                }
            }
        });
        return true;
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
    handleUpdateClick(field, value){
        /*
         if(field === 'id' || field === 'date' || field === 'type' || field === 'amount' || field === 'comment'){
            this.data[field]= value;
            $(this.domElements[field]).text(value);
            return true;
        } else {
            return false;
        }
         */
        const checkedValue = this.getAllCheckedId();

        if(checkedValue.length === 0){
            const noItemSelectedDiv = $('<div>').text('Please select one item.');
            noItemSelectedDiv.appendTo($('.modal-body'));
            return;
        }

        let updateFormDiv = $('<div>');
        $('.form').clone().appendTo(updateFormDiv);
        updateFormDiv.appendTo($('.modal-body'));

        $('.modal-body .form').find($('label.expenseType')).attr('for', 'updateExpenseType');
        $('.modal-body .form').find($('select.expenseType')).attr('id', 'updateExpenseType');

        $('.modal-body .form').find($('label.expenseDate')).attr('for', 'updateExpenseDate');
        $('.modal-body .form').find($('input.expenseDate')).attr('id', 'updateExpenseDate');

        $('.modal-body .form').find($('label.vendor')).attr('for', 'updateVendor');
        $('.modal-body .form').find($('input.vendor')).attr('id', 'updateVendor');

        $('.modal-body .form').find($('label.city')).attr('for', 'updateCity');
        $('.modal-body .form').find($('input.city')).attr('id', 'updateCity');

        $('.modal-body .form').find($('label.state')).attr('for', 'updateState');
        $('.modal-body .form').find($('select.state')).attr('id', 'updateState');

        $('.modal-body .form').find($('label.amount')).attr('for', 'updateAmount');
        $('.modal-body .form').find($('input.amount')).attr('id', 'updateAmount');
        $('.modal-body .form').find($('select.currency')).attr('id', 'updateCurrency');


        $('.modal-body .form').find($('label.paymentMethod')).attr('for', 'updatePaymentMethod');
        $('.modal-body .form').find($('select.paymentMethod')).attr('id', 'updatePaymentMethod');

        $('.modal-body .form').find($('label.comment')).attr('for', 'updateComment');
        $('.modal-body .form').find($('input.comment')).attr('id', 'updateComment');

        $.ajax({
            url: 'http://localhost/expense_tracker/server/getAllExpenses.php',
            method: 'POST',
            data: {expense_idArr: checkedValue},
            dataType: 'json',
            success: response => {
                response.data.map(item => {
                    console.log('item:', item);
                    const type = item.type.toLowerCase();
                    updateFormDiv.find($(`#updateExpenseType option[value=${type}]`)).attr('selected', true);
                    updateFormDiv.find($(`#updateExpenseDate`)).val(item.date);
                    updateFormDiv.find($(`#updateVendor`)).val(item.vendor);
                    updateFormDiv.find($(`#updateCity`)).val(item.city);
                    updateFormDiv.find($(`#updateState option[value=${item.state}]`)).attr('selected', true);
                    updateFormDiv.find($(`#updateAmount`)).val(item.amount);
                    updateFormDiv.find($(`#updateCurrency option[value=${item.amount}]`)).attr('selected', true);
                    updateFormDiv.find($(`#updatePaymentMethod option[value='${item.paymentMethod}']`)).attr('selected', true);
                    updateFormDiv.find($(`#updateComment`)).val(item.comment);
                })
            }
        });

    }

    handleUpdateConfirm(){

    }

    handleSearchClick(){
        const value = $('.searchBtn').val();

        if(value) {
            this.handleGetData(this.displayExpenses, value);
        }
    }

    handleCancelClick(){
        $('.modal-body').empty();
    }
    /* getStudentByField - find a particular student by an arbitrary field, for example find the student with a name of "John Smith"
    purpose:
        take in a field and value,
        iterate through the student list
        search for the object with the field by the value
        return that student if found, -1 if not
    params:
        (string) field - the property of the student to look through (for example, name, or course, or grade)
        (multiple) value - the value to search for, for example 'Jack' or 5
    return: (ExpenseList) student if found, (Number) -1 if not found
    */
    getStudentByField( field, value ){

        for(var index = 0; index < this.dataArray.length; index++){
            if(this.dataArray[index].data[field] === value){
                return this.dataArray[index];
            }
        }
        return -1;
    }


    handleGetData (callThisFunctionAfterWeGetData, value){
        //var self = this;
        $.ajax({
            //url: 'http://s-apis.learningfuze.com/sgt/get',
            url: 'http://localhost/expense_tracker/server/getAllExpenses.php',
            method: 'POST',
            dataType: 'json',
            data: {searchValue: value},
            success: (function (response) {

                for (var index = 0; index < response.data.length; index++) {
                    var date = response.data[index].date;
                    var type = response.data[index].type;
                    var vendor = response.data[index].vendor;
                    var id = response.data[index].id;
                    var city = response.data[index].city;
                    var state = response.data[index].state;
                    var amount = response.data[index].amount;
                    var currency = response.data[index].currency;
                    var paymentMethod = response.data[index].paymentMethod;
                    var comment = response.data[index].comment;


                    this.add(id, date, type, vendor, city, state, amount, currency, paymentMethod, comment); //self.add()
                }

                callThisFunctionAfterWeGetData()

            }).bind(this) //: is like =, when the computer read the lines and construct the object it will take care the right side first before the left side of the colon;
            // so when it reads .bind(this) the object hasn't finished constructing yet so it is not a object yet, 'this' still reference to the model object.
        })//.then( someFunction )
    }

    handleSelectAllClick (){
        $('.allCheckbox').click(this.handleSelectAll);
    }

    handleSelectAll (){
        const checkboxElem = $('.checkbox');
        if($('.checkbox:checked').length !== checkboxElem.length){
            checkboxElem.prop('checked', true);
        } else {
            checkboxElem.prop('checked', false);
        }
    }
}