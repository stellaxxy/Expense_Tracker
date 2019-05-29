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
        this.handleTypeSearchClick = this.handleTypeSearchClick.bind(this);
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

    updateDataArray(id, date, type, vendor, city, state, amount, currency, paymentMethod, comment){
        const transformedObj = this.handleTransformCases(type, city, vendor);
        type = transformedObj.type;
        city = transformedObj.city;
        vendor = transformedObj.vendor;
        amount = parseFloat(amount).toFixed(2);

        for(let index = 0; index < this.dataArray.length; index++){
            if(this.dataArray[index].data.id === id){
                const item = this.dataArray[index];

                item.data.date = date;
                item.data.type = type;
                item.data.vendor = vendor;
                item.data.city = city;
                item.data.state = state;
                item.data.amount = amount;
                item.data.currency = currency;
                item.data.paymentMethod = paymentMethod;
                item.data.comment = comment;
            }
        }
    }

    handleDeleteBtn = ()=>{
        const checkedValue = this.getAllCheckedId();
        let message = '';
        $('.deleteConfirmModalBody').empty();
        if(checkedValue.length === 0){
            message = $('<p>').text('Please select an item.').addClass('deleteConfirmMessage');

        } else {
            message = $('<p>').text('Are you sure you want to delete the selected item?').addClass('deleteConfirmMessage');
        }
        message.appendTo($('.deleteConfirmModalBody'));
        $('.deleteConfirmModal').show();
    };

    handleDelete (){
        $('.deleteConfirmModal').modal('hide');
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
                if(this.dataArray[index].data.id == id){
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

        let message = '';
        message = $('<div>').addClass("spinner-border").attr('role', 'status');
        let spinner = $('<span>').text('Loading...').addClass('sr-only');
        spinner.appendTo(message);
        message.appendTo($('.deleteConfirmModalBody'));
        $('.deleteConfirmModal').show();

        $.ajax({
            url: 'http://stellaxyh.com/expensetracker/server/deleteExpense.php',
            method: 'POST',
            data: {expense_idArr: idArr},
            dataType: 'json',
            success: function(response){

                $('.deleteConfirmModal').modal('hide');
                if(response.errors){

                    message = $('<p>').text(response.errors);
                    message.appendTo($('.deleteConfirmModalBody'));
                    $('.deleteConfirmModal').show();
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
    handleUpdateClick(){
        const checkedValue = this.getAllCheckedId();

        $('.modal-body.updateBody').empty();
        const updateBtn = $('<button>').text('UPDATE').addClass('updateConfirmBtn btn').click(this.handleUpdateConfirmClick);
        const cancelBtn = $('<button>').text('CANCEL').addClass('updateCancelBtn btn').attr({'data-dismiss': 'modal'});
        $('.updateBottomContainer.modal-footer').empty();
        $('.updateBottomContainer.modal-footer').append(updateBtn, cancelBtn);

        if(checkedValue.length === 0){
            const noItemSelectedDiv = $('<div>').text('Please select one item.');
            noItemSelectedDiv.appendTo($('.modal-body'));
            return;
        }

        let updateFormDiv = $('<div>');
        $('.expense-add-form .form.originalForm').clone().appendTo(updateFormDiv);
        updateFormDiv.appendTo($('.modal-body.updateBody'));

        $('.modal-body.updateBody .form.originalForm').find($('label.expenseType')).attr('for', 'updateExpenseType');
        $('.modal-body.updateBody .form.originalForm').find($('select.expenseType')).attr('id', 'updateExpenseType');

        $('.modal-body.updateBody .form.originalForm').find($('label.expenseDate')).attr('for', 'updateExpenseDate');
        $('.modal-body.updateBody .form.originalForm').find($('input.expenseDate')).attr('id', 'updateExpenseDate');

        $('.modal-body.updateBody .form.originalForm').find($('label.vendor')).attr('for', 'updateVendor');
        $('.modal-body.updateBody .form.originalForm').find($('input.vendor')).attr('id', 'updateVendor');

        $('.modal-body.updateBody .form.originalForm').find($('label.city')).attr('for', 'updateCity');
        $('.modal-body.updateBody .form.originalForm').find($('input.city')).attr('id', 'updateCity');

        $('.modal-body.updateBody .form.originalForm').find($('label.state')).attr('for', 'updateState');
        $('.modal-body.updateBody .form.originalForm').find($('select.state')).attr('id', 'updateState');

        $('.modal-body.updateBody .form.originalForm').find($('label.amount')).attr('for', 'updateAmount');
        $('.modal-body.updateBody .form.originalForm').find($('input.amount')).attr('id', 'updateAmount');
        $('.modal-body.updateBody .form.originalForm').find($('select.currency')).attr('id', 'updateCurrency');


        $('.modal-body.updateBody .form.originalForm').find($('label.paymentMethod')).attr('for', 'updatePaymentMethod');
        $('.modal-body.updateBody .form.originalForm').find($('select.paymentMethod')).attr('id', 'updatePaymentMethod');

        $('.modal-body.updateBody .form.originalForm').find($('label.comment')).attr('for', 'updateComment');
        $('.modal-body.updateBody .form.originalForm').find($('input.comment')).attr('id', 'updateComment');

        $.ajax({
            url: 'http://stellaxyh.com/expensetracker/server/getAllExpenses.php',
            method: 'POST',
            data: {expense_idArr: checkedValue},
            dataType: 'json',
            success: response => {
                response.data.map(item => {
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

    handleUpdateConfirmClick = ()=>{
        const checkedId = this.getAllCheckedId();

        const id = checkedId[0];
        let type = $('#updateExpenseType').val();
        const date = $('#updateExpenseDate').val();
        let vendor = $('#updateVendor').val();
        let city = $('#updateCity').val();
        const state = $('#updateState').val();
        const amount = $('#updateAmount').val();
        const currency = $('#updateCurrency').val();
        const paymentMethod = $('#updatePaymentMethod').val();
        const comment = $('#updateComment').val();

        $.ajax({
            url: 'http://stellaxyh.com/expensetracker/server/updateExpense.php',
            method: 'POST',
            data: {id, type, date, vendor, city, state, amount, currency, paymentMethod, comment},
            dataType: 'json',
            success: response => {
                $('.modal-body.updateBody').empty();
                $('.modal-footer.updateBottomContainer').empty();
                if(response.success){
                    const successMessage = $('<div>').text('Successfully Updated');
                    successMessage.appendTo($('.modal-body.updateBody'));

                    this.updateDataArray(id, date, type, vendor, city, state, amount, currency, paymentMethod, comment);
                    this.displayExpenses();
                } else {
                    let error = '';
                    for(let index = 0; index < response.error.length; index++){
                        error = error + response.error[index];
                    }
                    const errorMessage = $('<div>').text(error);
                    errorMessage.appendTo($('.modal-body.updateBody'));
                }
                const closeBtn = $('<button>').text('CLOSE').attr('data-dismiss', 'modal');
                //closeBtn.click(this.handlePutBackUpdateBtn);
                closeBtn.appendTo($('.modal-footer.updateBottomContainer'));

            }
        });
    };

    handleTransformCases(type, city, vendor){
        type = type.toUpperCase();

        const vendorArr = vendor.split(' ');
        const capitalizedVendorArr = vendorArr.map(item => {
            return item.charAt(0).toUpperCase() + item.slice(1);
        });
        const capitalizedVendor = capitalizedVendorArr.join(' ');

        const cityArr = city.split(' ');
        const capitalizedCityArr = cityArr.map(item => {
            return item.charAt(0).toUpperCase() + item.slice(1);
        });
        const capitalizedCity = capitalizedCityArr.join(' ');

        return {type, city: capitalizedCity, vendor: capitalizedVendor};
    }

    handleTypeSearchClick(elem){
        let type = elem.target.text;
        type = type.toLowerCase();
        this.handleGetData(this.displayExpenses, 'type', type);
    }

    handleSearchAllClick = ()=> {
        this.handleGetData(this.displayExpenses);
    };

    handleSubmenuClick = ()=>{
        $('.dropdown-submenu > a').on('click', ()=>{
            event.stopPropagation();
            event.preventDefault();
        })
    };

    handleAddModalClick = ()=>{
        /*
        $('.expense-add-form').addClass('modal fade').attr({id: 'addModal', role: 'dialog'});
        $('.addExpenseModalSecondDiv').addClass('modal-dialog');
        $('.addExpenseModalThirdDiv').addClass('modal-content');
        $('.addExpenseHeader').addClass('modal-header');
        $('.form').addClass('modal-body').css({'margin': '15px'});
        $('.addExpenseBtnContainer').addClass('modal-footer');
        $('.addExpenseHeader h4').addClass('modal-title');
        $('#cancelButton').attr('data-dismiss', 'modal');
        $('.expenseType option').css({'font-size': '14px', 'width': '25px'})
        */
        $('.modal-body.addForm').empty();

        let addFormDiv = $('<div>');
        $('.expense-add-form .form.originalForm').clone().appendTo(addFormDiv);
        addFormDiv.appendTo($('.modal-body.addForm'));

        $('.modal-body.addForm .form.originalForm').find($('label.expenseType')).attr('for', 'addExpenseType');
        $('.modal-body.addForm .form.originalForm').find($('select.expenseType')).attr('id', 'addExpenseType');

        $('.modal-body.addForm .form.originalForm').find($('label.expenseDate')).attr('for', 'addExpenseDate');
        $('.modal-body.addForm .form.originalForm').find($('input.expenseDate')).attr('id', 'addExpenseDate');

        $('.modal-body.addForm .form.originalForm').find($('label.vendor')).attr('for', 'addVendor');
        $('.modal-body.addForm .form.originalForm').find($('input.vendor')).attr('id', 'addVendor');

        $('.modal-body.addForm .form.originalForm').find($('label.city')).attr('for', 'addCity');
        $('.modal-body.addForm .form.originalForm').find($('input.city')).attr('id', 'addCity');

        $('.modal-body.addForm .form.originalForm').find($('label.state')).attr('for', 'addState');
        $('.modal-body.addForm .form.originalForm').find($('select.state')).attr('id', 'addState');

        $('.modal-body.addForm .form.originalForm').find($('label.amount')).attr('for', 'addAmount');
        $('.modal-body.addForm .form.originalForm').find($('input.amount')).attr('id', 'addAmount');
        $('.modal-body.addForm .form.originalForm').find($('select.currency')).attr('id', 'addCurrency');


        $('.modal-body.addForm .form.originalForm').find($('label.paymentMethod')).attr('for', 'addPaymentMethod');
        $('.modal-body.addForm .form.originalForm').find($('select.paymentMethod')).attr('id', 'addPaymentMethod');

        $('.modal-body.addForm .form.originalForm').find($('label.comment')).attr('for', 'addComment');
        $('.modal-body.addForm .form.originalForm').find($('input.comment')).attr('id', 'addComment');

    };

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


    handleGetData (callThisFunctionAfterWeGetData, type, value){
        const data = {};
        if(type&&value){
            data['searchType'] = type;
            data['searchValue'] = value;
        }
        $.ajax({
            url: 'http://stellaxyh.com/expensetracker/server/getAllExpenses.php',
            method: 'POST',
            dataType: 'json',
            data: data,
            success: response => {
                this.dataArray = [];
                if(response.data){
                    response.data.map(item => {
                        this.add(item.id, item.date, item.type, item.vendor, item.city, item.state, item.amount, item.currency, item.paymentMethod, item.comment)
                    });
                }
                callThisFunctionAfterWeGetData()

            } //: is like =, when the computer read the lines and construct the object it will take care the right side first before the left side of the colon;
            // so when it reads .bind(this) the object hasn't finished constructing yet so it is not a object yet, 'this' still reference to the model object.
        })
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