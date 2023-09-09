import { Pack } from '../types/pack';
//import { validatePackageSalesPriceIsSumOfItsComponents } from '../utils/validation';
import onePackSixUnities from './one_pack_with_6_units';
import onePackTwoDifUnits from './one_pack_with_2_different_units';
import anotherPackTwoDifUnits from './another_pack_with_2_different_packs';

/* 
describe('validatePackageSalesPriceIsSumOfItsComponents', () => {
    it('should receive one pack with n units of the same product summing up to the packs value and return true', () => {
        const expected = true;
        const validation = validatePackageSalesPriceIsSumOfItsComponents(onePackSixUnities as any[]);
        expect(validation).toEqual(expected);
    });
    
    it('should receive one pack with n units of different products summing up to the packs value and return true', () => {
        const expected = true;
        let validation = false;
        validation = validatePackageSalesPriceIsSumOfItsComponents(onePackTwoDifUnits as any[]);
        expect(validation).toEqual(expected);
        
        validation = validatePackageSalesPriceIsSumOfItsComponents(anotherPackTwoDifUnits as any[]);
        expect(validation).toEqual(expected);
    });
});
 */