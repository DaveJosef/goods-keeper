
import { ProductUpdate } from "../types/productUpdate";
import * as dbProducts from '../db/products';
import * as dbProductPacks from '../db/ProductPacks';
import { Product } from "../types/product";
import { Pack } from "../types/pack";
import { PackCollection } from "../types/packCollection";
import one_pack_with_6_units from "../tests/one_pack_with_6_units";
import { ValidationError } from "../exceptions/validationError";

const snakeCaseNotNumbersNotUppercase = /^[a-z]+(?:_[a-z]+)*$/;

const validateSnakeCase = (field: string) => {
    return snakeCaseNotNumbersNotUppercase.test(field);
}

const validateHeaders = (headers: string[]) => {
    return headers.reduce((prev, curr) => validateSnakeCase(curr) && prev, true);
}

const isArray = (arr: any[]) => {
    return (typeof arr === 'object' && arr.length !== undefined);
}

const isNumber = (numberString: string) => {
    return !!Number(numberString);
}
/* 
const getValues = (arr: string[][]) => {
    return arr.slice(1);
}
 */
const isArrayOfNumbers = (arr: string[]) => {
    return arr.reduce((prev, curr) => isNumber(curr) && prev, true);
}

const validateFields = (splitCsv: string[][]) => {
    const fieldsCount = 2;
    const isAnArray = isArray(splitCsv);
    const containsAtLeastOneArray = isArray(splitCsv[0]);
    const headersAreValid = validateHeaders(splitCsv[0]);
    const containsNHeaders = splitCsv[0].length === fieldsCount;
    //const valuesAreNumbers = getValues(splitCsv);
    /* const isAllString = splitCsv.reduce((prev, curr) => typeof curr === 'string' && prev, true);
    const haveAtLeastNFields = splitCsv.reduce((prev, curr, index) => index < fieldsCount ? typeof curr === 'string' && prev :, true); */
};

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
/* 
const validatePackageSalesPriceIsSumOfItsComponents = (packs: Pack[]) => {

    //const packs: Pack[] = await dbProductPacks.findPacksByPackCode(packProductCode);
    if (!packs || !packs.length) {
        throw new Error('Product is not a Package or the Product Is Inexistent');
    }
    const sum = packs.reduce((prev, curr) => Number(curr.component_product.salesPrice) * Number(curr.qty) + prev, 0.0);
    if (Number(packs[0].pack_product.salesPrice) === Number(sum.toFixed(2))) return true;
    return false;

}
 */
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
    for (const productUpdate of productsUpdate) {
        
        const productIsPack = await isPack(productUpdate.product_code);
        console.log({productIsPack});
        if(productIsPack) {
            let sumOfItsComponents = 0;
            /*const components = await dbProductPacks.findComponentsOfPack(productUpdate.product_code);

            for (const comp of components) {
                const compListIndex = productsUpdate.findIndex((element) => element.product_code === Number(comp.code));
                const compIsInList = compListIndex !== -1;
                if (!compIsInList) throw new Error('The CSV File Must Contain all Components of Package P if an Update for Package P is Provided');
                sumOfItsComponents += Number(components[compListIndex].salesPrice);
            } */
            try {
                sumOfItsComponents = await sumComponents(productUpdate.product_code, productsUpdate);
            } catch (err: any) {
                if (err.message === 'Component Not Found In The List')
                    throw new Error('The CSV File Must Contain all Components of Package P if an Update for Package P is Provided');
                else throw new Error(err.message);
            }

            console.log('chegou no pack')
            if (productUpdate.new_price !== sumOfItsComponents)
                throw new Error('The new_price of the Package Must be Equal to the Sum of the new_price of its Components');

        } else {
            
            const containingPacks = await dbProductPacks.findPacksByComponentCode(productUpdate.product_code);
            console.log({containingPacks});
            for (const containingPack of containingPacks) {
                const containerListIndex = productsUpdate.findIndex((element) => element.product_code === Number(containingPack.packId));
                const isInList = containerListIndex !== -1;
                if (!isInList) throw new Error('The CSV File Must Contain all Containers of Component K if an Update for Component K is Provided');
                    
                let sumOfItsComponents = 0;
                
                try {
                    sumOfItsComponents = await sumComponents(Number(containingPack.packId), productsUpdate);
                } catch (err) {
                    throw new Error('The CSV File Must Contain all Components of Package P if an Update for Package P is Provided');
                }

                const container = productsUpdate[containerListIndex];
                console.log({sumOfItsComponents});
                console.log({sumOfItsComponents: container.new_price});
                console.log('chegou no comp')
                if (container.new_price !== sumOfItsComponents)
                    throw new Error('The new_price of the Package Must be Equal to the Sum of the new_price of its Components');

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
    validateFields,
    validateSnakeCase,
    isNumber,
    getValidator,
    //validatePackageSalesPriceIsSumOfItsComponents,
    validatePackageSalesPriceIsSumOfItsComponentsProductUpdate,
    isValidArray,
};
