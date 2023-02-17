import { useReducer } from "react";

interface inputValTypes {
    inputVal: string
    placeholder: boolean,
    isUp: boolean
}

interface actionType {
    payload: inputValTypes
}

function handleInputChange(state: any, action: actionType) {
    if (action.payload.inputVal.length > 0) {
        return {
            inputVal: action.payload.inputVal,
            placeholder: true
            
        }
    } else if (action.payload.inputVal.length <= 0 && action.payload.placeholder && action.payload.isUp) {
        return {
            inputVal: action.payload.inputVal,
            placeholder: true
            
        }
    } else if (action.payload.inputVal.length <= 0 && !action.payload.placeholder && !action.payload.isUp) {
        return {
            inputVal: action.payload.inputVal,
            placeholder: false
            
        }
    } else {
        return {
            inputVal: action.payload.inputVal,
            placeholder: action.payload.placeholder,
            
        }
    }
}

function useInputStyles(initalValue: inputValTypes) {
    const [inputStyles, setInputStyles] = useReducer(handleInputChange, initalValue)

    return [inputStyles, setInputStyles]
}

export default useInputStyles