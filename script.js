/**
 * *****************************************************************************
 * CONSTANTS
 * *****************************************************************************
 */
const SIGNREGEX = /[\+\-\*\/]/;
const ADD_TO_OPERATION = "ADD_TO_OPERATION";
const CLEAR_OPERATION = "CLEAR_OPERATION";
const SOLVE_OPERATION = "SOLVE_OPERATION";
const DELETE_LAST_CHAR = "DELETE_LAST_CHAR";
const KEYBOARD = [
{
  value: "/",
  id: "divide",
  width: "col-3",
  buttonColor: "sign-button",
  disabled: false },

{
  value: "*",
  id: "multiply",
  width: "col-3",
  buttonColor: "sign-button",
  disabled: false },

{
  value: "+",
  id: "add",
  width: "col-3",
  buttonColor: "sign-button",
  disabled: false },

{
  value: "-",
  id: "subtract",
  width: "col-3",
  buttonColor: "sign-button",
  disabled: false },

{
  value: "9",
  id: "nine",
  width: "col-3",
  buttonColor: "btn-secondary",
  disabled: false },

{
  value: "8",
  id: "eight",
  width: "col-3",
  buttonColor: "btn-secondary",
  disabled: false },

{
  value: "7",
  id: "seven",
  width: "col-3",
  buttonColor: "btn-secondary",
  disabled: false },

{
  value: "C",
  id: "clear",
  width: "col-3",
  buttonColor: "btn-warning",
  disabled: false },

{
  value: "6",
  id: "six",
  width: "col-3",
  buttonColor: "btn-secondary",
  disabled: false },

{
  value: "5",
  id: "five",
  width: "col-3",
  buttonColor: "btn-secondary",
  disabled: false },

{
  value: "4",
  id: "four",
  width: "col-3",
  buttonColor: "btn-secondary",
  disabled: false },

{
  value: "=",
  id: "equals",
  width: "col-3",
  buttonColor: "btn-info",
  disabled: false },

{
  value: "3",
  id: "three",
  width: "col-3",
  buttonColor: "btn-secondary",
  disabled: false },

{
  value: "2",
  id: "two",
  width: "col-3",
  buttonColor: "btn-secondary",
  disabled: false },

{
  value: "1",
  id: "one",
  width: "col-3",
  buttonColor: "btn-secondary",
  disabled: false },

{ value: "", width: "col-3", buttonColor: "btn-secondary", disabled: true },
{
  value: "0",
  id: "zero",
  width: "col-6",
  buttonColor: "btn-secondary",
  disabled: false },

{
  value: ".",
  id: "decimal",
  width: "col-3",
  buttonColor: "btn-secondary",
  disabled: false },

{ value: "", width: "col-3", buttonColor: "btn-secondary", disabled: true }];

/**
 * *****************************************************************************
 * REDUX
 * *****************************************************************************
 */
const addToOperation = payload => ({ type: ADD_TO_OPERATION, payload });
const clearOperation = () => ({ type: CLEAR_OPERATION });
const solveOperation = () => ({ type: SOLVE_OPERATION });
const deleteLastChar = () => ({ type: DELETE_LAST_CHAR });
const operationReducer = (state = "0", action) => {
  switch (action.type) {
    case ADD_TO_OPERATION:
      if (state === "0") return action.payload;
      return state + action.payload;
    case CLEAR_OPERATION:
      return "0";
    case DELETE_LAST_CHAR:
      return state.slice(0, -1);
    case SOLVE_OPERATION:
      return eval(state).toString();
    default:
      return state;}

};
const store = Redux.createStore(operationReducer);
/**
 * *****************************************************************************
 * REACT
 * *****************************************************************************
 */
/**
 * -----------------------------------------------------------------------------
 * Keyboard
 * -----------------------------------------------------------------------------
 */
class Keyboard extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  /**
   * Handle Click
   * -------------------------------------------------------------------------
   */
  handleClick(e) {
    const { value } = e.target;
    if (value === "0" && this.props.operation === "0") return;
    if (value === "." && this.verifyDots()) return;
    if (SIGNREGEX.test(value) && !this.acceptNegative(value)) return;
    if (value === "=") {
      this.props.solveOperation();
    } else if (value === "C") this.props.clearOperation();else
    this.props.addToOperation(value);
  }
  /**
   * Verify Dots
   * -------------------------------------------------------------------------
   */
  verifyDots() {
    const array = this.props.operation.split(SIGNREGEX);
    const lastSign = array[array.length - 1];
    return lastSign.includes(".");
  }
  acceptNegative(value) {
    const regex = /\d/;
    const array = this.props.operation.split(regex);
    const lastSign = array[array.length - 1];
    if (lastSign !== "" && value !== "-") this.props.deleteLastChar();
    if (lastSign.length >= 2) this.props.deleteLastChar();
    return true;
  }
  /**
   * Add to Keyboard Line
   * -------------------------------------------------------------------------
   */
  addToKeyboardLine(key) {
    let buttonClass = "btn btn-outline-dark py-3";
    if (key.disabled === true) buttonClass = "invisible";
    return React.createElement(
    "button",
    {
      className: `${buttonClass} ${key.width} ${key.buttonColor}`,
      id: key.id,
      value: key.value,
      disabled: key.disabled,
      onClick: this.handleClick },

    key.value);

  }
  /**
   * Add to Keyboard
   * -------------------------------------------------------------------------
   */
  addToKeyboard(keyboardLine) {
    return React.createElement(
    "div",
    { className: "btn-group w-100" },
    keyboardLine);

  }
  /**
   * Render
   * -------------------------------------------------------------------------
   */
  render() {
    let keyboardLine = [];
    let keyboard = [];
    let counter = 0;
    for (let i = 0; i < KEYBOARD.length; i++) {
      const key = KEYBOARD[i];
      keyboardLine.push(this.addToKeyboardLine(key));
      counter++;
      if (counter === 4) {
        keyboard.push(this.addToKeyboard(keyboardLine));
        keyboardLine = [];
        counter = 0;
      }
    }
    if (keyboardLine.length > 0) {
      keyboard.push(this.addToKeyboard(keyboardLine));
    }
    return React.createElement("div", {}, keyboard);
  }}

/**
 * -----------------------------------------------------------------------------
 * Display
 * -----------------------------------------------------------------------------
 */
class Display extends React.Component {
  constructor(props) {
    super(props);
  }
  /**
   * Render
   * -------------------------------------------------------------------------
   */
  render() {
    return React.createElement(
    "div",
    {
      className:
      "text-black p-3 mb-3 rounded text-end border border-dark",
      id: "display" },

    this.props.operation);

  }}

/**
 * -----------------------------------------------------------------------------
 * Calculator
 * -----------------------------------------------------------------------------
 */
class Calculator extends React.Component {
  constructor(props) {
    super(props);
  }
  /**
   * Render
   * -------------------------------------------------------------------------
   */
  render() {
    return React.createElement(
    "div",
    {
      className: "w-50 p-3 rounded shadow border border-dark",
      id: "calculator" },

    React.createElement(Display, { operation: this.props.operation }),
    React.createElement(
    Keyboard,
    {
      operation: this.props.operation,
      addToOperation: this.props.addToOperation,
      clearOperation: this.props.clearOperation,
      solveOperation: this.props.solveOperation,
      deleteLastChar: this.props.deleteLastChar,
      alertTest: this.alertTest },

    null));


  }}

/**
 * *****************************************************************************
 * REACT REDUX
 * *****************************************************************************
 */
const Provider = ReactRedux.Provider;
const connect = ReactRedux.connect;
const mapStateToProps = state => ({ operation: state });
const mapDispatchToProps = dispatch => ({
  addToOperation: payload => dispatch(addToOperation(payload)),
  clearOperation: () => dispatch(clearOperation()),
  solveOperation: () => dispatch(solveOperation()),
  deleteLastChar: () => dispatch(deleteLastChar()) });

const CalculatorContainer = connect(
mapStateToProps,
mapDispatchToProps)(
Calculator);
/**
 * -----------------------------------------------------------------------------
 * AppWrapper
 * -----------------------------------------------------------------------------
 */
class AppWrapper extends React.Component {
  render() {
    return React.createElement(
    Provider,
    { store: store },
    React.createElement(CalculatorContainer, null));

  }}

/**
 * *****************************************************************************
 * RENDER
 * *****************************************************************************
 */
const container = document.getElementById("app");
container.className =
"container-fluid d-flex flex-column min-vh-100 " +
"justify-content-center align-items-center bg-secondary";
ReactDOM.render(React.createElement(AppWrapper, null), container);