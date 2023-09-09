
import { ProductUpdate } from "../types/productUpdate";
import * as dbProducts from '../db/products';
import * as dbProductPacks from '../db/ProductPacks';
import { Product } from "../types/product";
import { Pack } from "../types/pack";
import { PackCollection } from "../types/packCollection";
import { ValidationError } from "../exceptions/validationError";

const snakeCaseNotNumbersNotUppercase = /^[a-z]+(?:_[a-z]+)*$/;

const validateSnakeCase = (field: string) => {
    return snakeCaseNotNumbersNotUppercase.test(field);
}

const isArray = (arr: any[]) => {
    return (typeof arr === 'object' && arr.length !== undefined);
}

const isNumber = (numberString: string) => {
    return !!Number(numberString);
}

const validators = {
    number: isNumber,
    array: isArray,
};

const getValidator = (type: 'number' | 'array') => {
    return validators[type];
}

const validatePercentageIncrease = (productUpdate: ProductUpdate, product: Product) => {

    return true;

}

const isPack = async (code: number) => {
    const packs = await dbProductPacks.findPacksByPackCode(code);
    if (!packs || !packs.length) {
        return false;
    }
    return true;
}

const getQtyGivenPackAndComp = async (packCode: number, compCode: number) => {

    const qtyOfCompInItsPack = (await dbProductPacks.findPackByComponentAndPackCode(packCode, compCode))?.qty;
    console.log({qtyOfCompInItsPack});
    return qtyOfCompInItsPack;

}

const sumComponents = async (code: number, productsUpdate: ProductUpdate[]) => {
    let sumOfItsComponents = 0;
    const components = await dbProductPacks.findComponentsOfPack(code);

    console.log('comps of '+code, {components});
    for (const comp of components) {
        const compListIndex = productsUpdate.findIndex((element) => element.product_code === Number(comp.code));
        console.log('index of '+code, {compListIndex});
        const compIsInList = compListIndex !== -1;
        console.log('compIsInList '+code, {compIsInList});
        if (!compIsInList) throw new Error('Component Not Found In The List');
        const compAtIndex = productsUpdate[compListIndex];
        console.log({compAtIndex});

        const qtyOfTheComp = await getQtyGivenPackAndComp(Number(code), Number(comp.code));
        sumOfItsComponents += Number(compAtIndex.new_price) * Number(qtyOfTheComp);
    }
    console.log({sumOfItsComponents});

    return Number(sumOfItsComponents.toFixed(2));
}

const validatePackageSalesPriceIsSumOfItsComponentsProductUpdate = async (productsUpdate: ProductUpdate[]) => {

    let packs = [];
    //for (const productUpdate of productsUpdate) {
    for (let i = 0; i < productsUpdate.length; i++) {
        const productUpdate = productsUpdate[i];
        
        const productIsPack = await isPack(productUpdate.product_code);
        console.log({productIsPack});
        if(productIsPack) {
            let sumOfItsComponents = 0;
            
            try {
                sumOfItsComponents = await sumComponents(productUpdate.product_code, productsUpdate);
            } catch (err: any) {
                if (err.message === 'Component Not Found In The List')
                    //throw new Error('The CSV File Must Contain all Components of Package P if an Update for Package P is Provided');
                    throw new ValidationError('The CSV File Must Contain all Components of Package P if an Update for Package P is Provided', i + 1, -1);
                else throw new Error(err.message);
            }

            console.log('chegou no pack')
            if (productUpdate.new_price !== sumOfItsComponents)
                throw new ValidationError('The new_price of the Package Must be Equal to the Sum of the new_price of its Components', i + 1, -1);

        } else {
            
            const containingPacks = await dbProductPacks.findPacksByComponentCode(productUpdate.product_code);
            console.log({containingPacks});
            //for (const containingPack of containingPacks) {
            for (let j = 0; j < containingPacks.length; j++) {
                const containingPack = containingPacks[j];
                const containerListIndex = productsUpdate.findIndex((element) => element.product_code === Number(containingPack.packId));
                const isInList = containerListIndex !== -1;
                if (!isInList) throw new ValidationError('The CSV File Must Contain all Containers of Component K if an Update for Component K is Provided', i + 1, -1);
                    
                let sumOfItsComponents = 0;
                
                try {
                    sumOfItsComponents = await sumComponents(Number(containingPack.packId), productsUpdate);
                } catch (err) {
                    //throw new Error('The CSV File Must Contain all Components of Package P if an Update for Package P is Provided');
                    throw new ValidationError('The CSV File Must Contain all Components of Package P if an Update for Package P is Provided', containerListIndex + 1, -1);
                }

                const container = productsUpdate[containerListIndex];
                console.log({sumOfItsComponents});
                console.log({sumOfItsComponents: container.new_price});
                console.log('chegou no comp')
                if (container.new_price !== sumOfItsComponents)
                    throw new ValidationError('The new_price of the Package Must be Equal to the Sum of the new_price of its Components', i, -1);

            }


        }

    }
    return true;

}

const validateSalesPriceIsNotLesserThanCostPrice = async (productUpdate: ProductUpdate) => {

    const product = await dbProducts.verifyProductExists(productUpdate.product_code);

    if (productUpdate.new_price < Number(product?.costPrice)) {
        return false;
    }

    return true;

}

const isValidArray = (productsUpdate: ProductUpdate[]) => {
    if (productsUpdate.length < 1) throw new ValidationError('Must have entries', 0, 0);
    return true;
}

export {
    validateSnakeCase,
    isNumber,
    getValidator,
    //validatePackageSalesPriceIsSumOfItsComponents,
    validatePackageSalesPriceIsSumOfItsComponentsProductUpdate,
    isValidArray,
};
