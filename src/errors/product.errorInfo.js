export const sendErrorInfo = (product) => 
  `One or more properties are incomplete or not valid.
  List of required properties:
  * title       : needs to be a string, received ${typeof product.title}
  * description : needs to be a string, received ${typeof product.description}
  * code        : needs to be a string, received ${typeof product.code}
  * price       : needs to be a number, received ${typeof product.price}
  * status      : needs to be a boolean, received ${typeof product.status}
  * stock       : needs to be a number, received ${typeof product.stock}
  * category    : needs to be a string, received ${typeof product.category}
  `