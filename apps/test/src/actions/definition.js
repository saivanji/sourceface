// TODO: Important, do not have function definition as action.
//
// Or instead of having inline functions pipe, make it consistent way. Function definition is not an action but can be achieved in more higher level way and contain inside multiple actions. So user defined function is a reusable composition of multiple actions. It can be defined either globally(application wise) or locally(field wise)
//
// Old approach:
//
// Provide ability to define function to make reusable parts so they can be used in loops and so on. Can have multiple functions pipe here. Action result might be also a function definition! not only a value. 2 types - value(variable, function call) and function definition
//
