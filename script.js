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
        addModalButton: $('#addModalButton'),
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
        deleteConfirmButton: $('#deleteConfirmModalButton'),
        deleteButton: $('.deleteBtn'),
        updateButton: $('.updateBtn'),
        updateCancelButton: $('.updateCancelBtn'),
        updateConfirmButton: $('.updateConfirmBtn'),
        searchType: $('.searchType li'),
        searchAll: $('.searchAll'),
        addButtonOnSmall: $('.addBtnContainer span'),
        searchSubMenu: $('.dropdown-submenu a'),
        addFormTypeInput: $('#addExpenseType'),
        addFormDateInput: $('#addExpenseDate'),
    });
    SGT.addEventHandlers();
    SGT.model.handleSelectAllClick();
    closeButtonClick();
}

function closeButtonClick(){
    $('.closeButton').click(closeButtonHandler);
}

function closeButtonHandler (){
    $('.errorMessage').hide();
}

/*
<div class="searchBtnContainer dropdown">
            <button class="btn searchBtn dropdown-toggle" type="button" data-toggle="dropdown">Search
            <span class="caret"></span></button>
            <ul class="dropdown-menu">
                <li class="searchAll"><a tabindex="-1" href="#">See All</a></li>
                <li class="dropdown-submenu">
                    <a href="#">By Type <span class="caret"></span></a>
                    <ul class="dropdown-menu searchType">
                        <li><a href="#">Mortgage</a></li>
                        <li><a href="#">Rent</a></li>
                        <li><a href="#">Car Payment</a></li>
                        <li><a href="#">Gas</a></li>
                        <li><a href="#">Parking</a></li>
                        <li><a href="#">Groceries</a></li>
                        <li><a href="#">Restaurants</a></li>
                        <li><a href="#">Utilities</a></li>
                        <li><a href="#">Clothing</a></li>
                        <li><a href="#">Medical</a></li>
                        <li><a href="#">Personal</a></li>
                        <li><a href="#">Education</a></li>
                        <li><a href="#">Gifts</a></li>
                        <li><a href="#">Entertainment</a></li>
                        <li><a href="#">Hotel</a></li>
                        <li><a href="#">Other</a></li>
                    </ul>
                </li>
            </ul>
        </div>
 */
/*
<div class="searchBtnContainer">
            <button class="btn searchBtn " type="button">Search
            <span class="caret"></span></button>
            <ul class="dropdownMainMenu">
                <li class="searchAll"><a href="#">See All</a></li>
                <li class="dropdownSubmenu">
                    <a href="#">By Type <span class="caret"></span></a>
                    <ul class="searchType">
                        <li><a href="#">Mortgage</a></li>
                        <li><a href="#">Rent</a></li>
                        <li><a href="#">Car Payment</a></li>
                        <li><a href="#">Gas</a></li>
                        <li><a href="#">Parking</a></li>
                        <li><a href="#">Groceries</a></li>
                        <li><a href="#">Restaurants</a></li>
                        <li><a href="#">Utilities</a></li>
                        <li><a href="#">Clothing</a></li>
                        <li><a href="#">Medical</a></li>
                        <li><a href="#">Personal</a></li>
                        <li><a href="#">Education</a></li>
                        <li><a href="#">Gifts</a></li>
                        <li><a href="#">Entertainment</a></li>
                        <li><a href="#">Hotel</a></li>
                        <li><a href="#">Other</a></li>
                    </ul>
                </li>
            </ul>
        </div>
 */