/* information about jsdocs:
* param: http://usejsdoc.org/tags-param.html#examples
* returns: http://usejsdoc.org/tags-returns.html
*
/**
 * Listen for the document to load and initialize the application
 */
$(document).ready( startApp );

var SGT;
function startApp(){
    /*
    startTests will test your code.  Once it works,
    delete startTests and uncomment the code below to run YOUR code and test it
    */
    // startTests();
    SGT = new SGT_template({
        addButton: $("#addButton"),
        cancelButton: $("#cancelButton"),
        typeInput: $("#expenseType"),
        dateInput: $("#expenseDate"),
        vendorInput: $("#vendor"),
        cityInput: $("#city"),
        stateInput: $("#state"),
        amountInput: $("#amount"),
        currencyInput: $("#currency"),
        paymentMethodInput: $("#paymentMethod"),
        commentInput: $("#comment"),
        displayArea: $("#displayArea"),
    });
    SGT.addEventHandlers();
    SGT.model.handleSelectAllClick();
    closeButtonClick();
    $('.deleteBtn').click(SGT.model.handleDelete);
    $('.updateBtn').click(SGT.model.handleUpdateClick);
    $('.updateCancelBtn').click(SGT.model.handleCancelClick);
    $('.searchBtn').click(SGT.model.handleSearchClick);
}

function closeButtonClick(){
    $('.closeButton').click(closeButtonHandler);
}

function closeButtonHandler (){
    $('.errorMessage').hide();
}