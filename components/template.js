class SGT_template{
    /* constructor - sets up sgt object
    params: (object) elementConfig - all pre-made dom elements used by the app.  See script.js for a list of elements coming in via the object
    purpose: instantiates a model and stores it in the object
    return: undefined
    */
    constructor( object ){
        this.addModal = false;
        this.displayAllExpenses = this.displayAllExpenses.bind(this);
        this.model = new Model(this.displayAllExpenses);
        this.elementConfig = object;
        this.handleCancel = this.handleCancel.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.model.handleGetData( this.displayAllExpenses );
    }
    /* addEventHandlers - add event handlers to premade dom elements
    adds click handlers to add and cancel buttons using the dom elements passed into constructor
    params: none
    return: undefined
    */

    addEventHandlers(){
        $(window).resize(this.displayAllExpenses);
        this.elementConfig.addButton.click(this.handleAddForm);
        this.elementConfig.addModalButton.click(this.handleModalAdd);
        this.elementConfig.cancelButton.click(this.handleCancel);
        this.elementConfig.deleteButton.click(this.model.handleDeleteBtn);
        this.elementConfig.deleteConfirmButton.click(this.model.handleDelete);
        this.elementConfig.updateButton.click(this.model.handleUpdateClick);
        this.elementConfig.updateCancelButton.click(this.model.handleCancelClick);
        this.elementConfig.updateConfirmButton.click(this.model.handleUpdateConfirmClick);
        this.elementConfig.searchType.click(this.model.handleTypeSearchClick);
        this.elementConfig.searchAll.click(this.model.handleSearchAllClick);
        this.elementConfig.searchSubMenu.click(this.model.handleSubmenuClick);
        this.elementConfig.addButtonOnSmall.click(this.model.handleAddModalClick);
    }
    /* clearInputs - take the three inputs and clear their values
    params: none
    return: undefined
    */
    clearInputs(){
        this.elementConfig.typeInput.val('');
        this.elementConfig.dateInput.val('');
        this.elementConfig.vendorInput.val('');
        this.elementConfig.cityInput.val('');
        this.elementConfig.stateInput.val('');
        this.elementConfig.amountInput.val('');
        this.elementConfig.currencyInput.val('USD');
        this.elementConfig.paymentMethodInput.val('');
        this.elementConfig.commentInput.val('');
    }
    /* handleCancel - function to handle the cancel button press
    params: none
    return: undefined
    */
    handleCancel(){
        this.elementConfig.typeInput.val('');
        this.elementConfig.dateInput.val('');
        this.elementConfig.vendorInput.val('');
        this.elementConfig.cityInput.val('');
        this.elementConfig.stateInput.val('');
        this.elementConfig.amountInput.val('');
        this.elementConfig.currencyInput.val('USD');
        this.elementConfig.paymentMethodInput.val('');
        this.elementConfig.commentInput.val('');
    }
    handleModalAdd= () =>{
        this.addModal = true;
        this.handleAdd();
    }
    handleAddForm = ()=>{
        this.addModal = false;
        this.handleAdd();
    };
    /* handleAdd - function to handle the add button click
    purpose: grabs values from inputs, utilizes the model's add method to save them, then clears the inputs and displays all students
    params: none
    return: undefined
    */
    handleAdd(){
        let type = '';
        let date = '';
        let vendor = '';
        let city = '';
        let state = '';
        let amount = '';
        let currency = '';
        let paymentMethod = '';
        let comment = '';

        if(this.addModal){
            type = $('#addExpenseType').val();
            date = $('#addExpenseDate').val();
            vendor = $('#addVendor').val();
            city = $('#addCity').val();
            state = $('#addState').val();
            amount = $('#addAmount').val();
            currency = $('#addCurrency').val();
            paymentMethod = $('#addPaymentMethod').val();
            comment = $('#addComment').val();
        } else {
            type = this.elementConfig.typeInput.val();
            date = this.elementConfig.dateInput.val();
            vendor = this.elementConfig.vendorInput.val();
            city = this.elementConfig.cityInput.val();
            state = this.elementConfig.stateInput.val();
            amount = this.elementConfig.amountInput.val();
            currency = this.elementConfig.currencyInput.val();
            paymentMethod = this.elementConfig.paymentMethodInput.val();
            comment = this.elementConfig.commentInput.val();
        }
        let id = null;

        const transformedObj = this.model.handleTransformCases(type, city, vendor);
        type = transformedObj.type;
        city = transformedObj.city;
        vendor = transformedObj.vendor;

        $('.errorMessage').show();
        $.ajax({
            url: 'https://stellaxyh.com/expensetracker/server/createExpense.php',
            method: 'POST',
            data: {type, date, vendor, city, state, amount, currency, paymentMethod, comment},
            dataType: 'json',
            success: (function(response){

                $('.errorMessage').hide();
                if(response.errors){
                    $('.loadingButton').hide();
                    $('.errorText').text(response.errors);
                    $('.errorMessage').show();
                }
                id = response.new_id;
                this.model.add(id, date, type, vendor, city, state, amount, currency, paymentMethod, comment);
                this.clearInputs();
                this.displayAllExpenses();
                $('#addModal').modal('hide');

            }).bind(this)
        });
    }
    /* displayAllStudents - iterate through all students in the model
    purpose:
        grab all students from model,
        iterate through the retrieved list,
        then render every student's dom element
        then append every student to the dom's display area
        then display the grade average
    params: none
    return: undefined
    */
    displayAllExpenses(){
        this.elementConfig.displayArea.empty();
        var allStudents = this.model.dataArray;
        for(var index = 0; index < allStudents.length; index++){
            var studentRow = allStudents[index].render();
            this.elementConfig.displayArea.append(studentRow);
        }
    }
}