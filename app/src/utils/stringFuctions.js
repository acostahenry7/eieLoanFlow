export function capitalize(str) {
  if (str){
    const strArr = str.split(' ')
    var result = "";
    for (var i of strArr){
        
      result += i.charAt(0).toUpperCase() + i.slice(1).toLowerCase() + " "

    }
    return result
  }

  return ""
     
  }


  export function extractIconText(str) {
    const strArr = str.split(' ' || '  ')

    if (strArr[strArr.length -1] == ""){
      strArr.pop("")
      }
    
      
    
    var result = ""
    switch (strArr.length) {
      
      
      case 2:
        for (var i=0; i<strArr.length; i++){
          result += strArr[i].charAt(0)  
        }
        break;
      case 3:
        for (var i=0; i<strArr.length; i++){
          if (i == 0 || i== 1){
            result += strArr[i].charAt(0)  
          }
        }
      break;
      case 4:
        for (var i=0; i<strArr.length; i++){
          if (i == 0 || i== 2){
            result += strArr[i].charAt(0)  
          }
        }
      break;    
      default: result = strArr[0].charAt(0)
        break;
    }

    return result
  }


  export function formatFullName(str, object) {
    var result = str?.split(' ').length > 2 ?  capitalize(object.first_name) : capitalize(object.first_name + " " + object.last_name) 

    if (str) return result
     
    return ""
}
