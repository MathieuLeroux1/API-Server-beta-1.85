import Controller from './Controller.js';
import { factorial, isPrime, findPrime } from '../utilities.js';
import fs from 'fs';
import path from 'path';

export default class MathsController extends Controller {
    constructor(HttpContext) {
        super(HttpContext, null);
    }

    get() {
        const params = this.HttpContext.path.params;
        
        if (params === null || Object.keys(params).length === 0) {
            const helpPagePath = path.join(process.cwd(), 'wwwroot', 'API-Help-Pages', 'API-Maths-Help.html');
            
            fs.readFile(helpPagePath, 'utf8', (err, data) => {
                if (err) {
                    console.error('Error reading help page:', err);
                    this.HttpContext.response.internalError('Could not load the help page');
                } else {
                    this.HttpContext.response.HTML(data);
                }
            });
            return;
        }

        const missingParams = [];
        const extraParams = [];
        let x, y, n, invalidParams=[];

        let error = null;

        const validParams = ["x", "y", "n"];
        let op = params.op;

        Object.keys(params).forEach(param => {
            if (!validParams.includes(param) && param !== 'op') {
                invalidParams.push(param);
            }
        });

        if (invalidParams.length > 0) {
            error = 'too many parameters';
        }

        switch (op) {
            case '+':
            case ' ':
                op = '+';
            case '-':
            case '*':
            case '/':
            case '%':
                x = parseFloat(params.x);
                y = parseFloat(params.y);

                if(params.x === undefined){
                    error = `'x' parameter is missing`;
                    missingParams.push('x');
                }
                else if (isNaN(x)) {
                    error = `'x' parameter is not a number`;
                }

                if(params.y === undefined){
                    error = `'y' parameter is missing`;
                    missingParams.push('y');
                }
                else if (isNaN(y)) {
                    error = `'y' parameter is not a number`;
                }

                if (params.n !== undefined) extraParams.push('n');
                break;
            case '!':
            case 'p':
            case 'np':
                n = parseFloat(params.n);

                if(params.n === undefined){
                    error = `'n' parameter is missing`;
                    missingParams.push('n');
                } else if (isNaN(n)) {
                    error = `'n' parameter is not a number`;
                } else if(n <= 0 || !Number.isInteger(n)){
                    error = `'n' parameter must be an integer > 0`;
                }
                if (params.x !== undefined) extraParams.push('x');
                if (params.y !== undefined) extraParams.push('y');
                break;
            default:
                if(op === null || op === "" || op === undefined){
                    error = `'op' parameter is missing`;
                }else{
                    error = `'op' parameter is invalid`;
                }
                x = params.x
                y = params.y
                n= params.n
                break;
        }

        if (error || invalidParams.length > 0 || missingParams.length > 0 || extraParams.length > 0) {
            const response = {
                op,
            };
            
            if (x !== undefined) {
                response.x = params.x;
            }
            
            if (y !== undefined) {
                response.y = params.y;
            }
            
            if (n !== undefined) {
                response.n = params.n;
            }
            
            invalidParams.forEach(param => {
                response[param] = params[param];
            });
            
            response.error = error || 'Parameter list incorrect';
            
            this.HttpContext.response.JSON(response);
            return;
        }
        
        let result;
        try {
            switch (op) {
                case '+':
                case ' ':
                    op = '+';
                    result = x + y;
                    break;
                case '-':
                    result = x - y;
                    break;
                case '*':
                    result = x * y;
                    break;
                case '/':
                    if(x === 0 && y === 0){
                        result = 'NaN';
                        break;
                    }else if(y === 0){
                        result ='Infinity';
                        break;
                    }
                    result = x / y;
                    break;
                case '%':
                    if(y === 0){
                        result = 'NaN';
                        break;
                    }
                    result = x % y;
                    break;
                case '!':
                    result = factorial(n);
                    break;
                case 'p':
                    result = isPrime(n);
                    break;
                case 'np':
                    result = findPrime(n);
                    break;
                default:
                    throw new Error('Invalid operation');
            }

            let goodOperation;
            switch(op){
                case '+':
                case ' ':
                    op = '+';
                    goodOperation = x + y === result;
                    break;
                case '-':
                    goodOperation = x - y === result;
                    break;
                case '*':
                    goodOperation = x * y === result;
                    break;
                case '/':
                    goodOperation = x / y === result;
                    break;
                case '%':
                    goodOperation = x % y === result;
                    break;
                case '!':
                    goodOperation = factorial(n) === result;
                    break;
                case 'p':
                    goodOperation = isPrime(n) === result;
                    break;
                case 'np':
                    goodOperation = findPrime(n) === result;
                    break;
                default:
                    throw new Error('Invalid operation');
            }

            if(!goodOperation){
                error = 'Operation doesn\'t give the right result'
            }

            if (error || invalidParams.length > 0 || missingParams.length > 0 || extraParams.length > 0) {
                const response = {
                    op,
                };
                
                if (x !== undefined) {
                    response.x = params.x;
                }
                
                if (y !== undefined) {
                    response.y = params.y;
                }
                
                if (n !== undefined) {
                    response.n = params.n;
                }
                
                invalidParams.forEach(param => {
                    response[param] = params[param];
                });
                
                response.error = error || 'Parameter list incorrect';
                
                this.HttpContext.response.JSON(response);
                return;
            }

            const response = {
                op,
                value: result 
            };
            
            if (x !== undefined) {
                response.x = params.x;
            }
            
            if (y !== undefined) {
                response.y = params.y;
            }
            
            if (n !== undefined) {
                response.n = params.n;
            }
            
            this.HttpContext.response.JSON(response);
        } catch (error) {
            console.log(error);
        }
    }

    post() {
        this.HttpContext.response.notAvailable('La méthode POST n\'est pas disponible');
    }

    put() {
        this.HttpContext.response.notAvailable('La méthode PUT n\'est pas disponible');
    }

    remove() {
        this.HttpContext.response.notAvailable('La méthode DELETE n\'est pas disponible');
    }
}
