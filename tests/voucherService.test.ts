import { jest } from "@jest/globals"
import voucherRepository from "repositories/voucherRepository";
import voucherService from "services/voucherService";

const vaucher ={
    code: "PASS90",
    discount: 10
};

const complitVoucher ={
    ...vaucher,
    id:1,
    used: false
}

describe("Testes unitarios na camada de service",() => {
  describe("Testes da funcao creatVoucher",() => {
    it("Testando para criacao de vaucher",async ()=> {
        
        jest.spyOn(
            voucherRepository, 
            "getVoucherByCode"
            )
            .mockImplementationOnce(
                (): any => {  });
        jest.spyOn(
            voucherRepository, 
            "createVoucher"
            )
            .mockImplementationOnce(
                (): any => { vaucher });

        const creat = 
            await voucherService.createVoucher(
                vaucher.code, 
                vaucher.discount
                );
        expect(undefined).toBe(creat);
    });

    it("Testando para vaucher unico",async ()=> {
       
        jest.spyOn(
            voucherRepository, 
            "getVoucherByCode"
            )
            .mockImplementationOnce(
                (): any => { 
                return vaucher 
        });
        
        const promise = voucherService.createVoucher(vaucher.code, vaucher.discount);
        expect(promise).rejects.toEqual({
            message: "Voucher already exist.", 
            type: "conflict"
        });

        
    });
    it("Testando para vaucher alfa numerico",async ()=> {
          
      jest.spyOn(
          voucherRepository, 
          "getVoucherByCode"
          )
          .mockImplementationOnce(
              (): any => {  });
      jest.spyOn(
          voucherRepository, 
          "createVoucher"
          )
          .mockImplementationOnce(
              (): any => { vaucher });
  
      const creat = 
          await voucherService.createVoucher(
              vaucher.code, 
              vaucher.discount
              );
      expect(undefined).toBe(creat);
        });
    });

  describe("Testes da funcao applyVoucher",() => {
    it("Testando para voucher nao existente",async ()=>{
        jest.spyOn(
            voucherRepository, 
            "getVoucherByCode"
            )
            .mockImplementationOnce(
                (): any => { 
                return undefined; 
        });
        const promise = voucherService.applyVoucher(vaucher.code, vaucher.discount);
 
        expect(promise).rejects.toEqual({
           message: "Voucher does not exist.", 
           type: "conflict"
        });
    });  

    it("Testando para voucher ja utilizado",async ()=>{
        const value = 101;
        jest.spyOn(
            voucherRepository, 
            "getVoucherByCode"
            )
            .mockImplementationOnce(
                (): any => { 
                return {...complitVoucher, used: true}; 
        });

        jest.spyOn(
            voucherRepository, 
            "useVoucher"
            )
            .mockImplementationOnce(
                (): any => { 
                return vaucher.code; 
        });
        
        
        const promise = await voucherService.applyVoucher(vaucher.code, value);

        expect(promise).toEqual({
            amount: value, 
            applied: false, 
            discount: vaucher.discount, 
            finalAmount: value
        });
      });

      it("Testando para voucher nao utilizado",async ()=>{
        const value = 101;
        jest.spyOn(
            voucherRepository, 
            "getVoucherByCode"
            )
            .mockImplementationOnce(
                (): any => { 
                return complitVoucher; 
        });

        jest.spyOn(
            voucherRepository, 
            "useVoucher"
            )
            .mockImplementationOnce(
                (): any => { 
                return vaucher.code; 
        });
        
        
        const promise = await voucherService.applyVoucher(vaucher.code, value);

        expect(promise).toEqual({
            amount: value, 
            applied: true, 
            discount: vaucher.discount, 
            finalAmount: value-(value*(vaucher.discount/100))
        });
      });

    it("Testando para valor minimo menor que 100",async ()=>{
        const value = 99;
        jest.spyOn(
            voucherRepository, 
            "getVoucherByCode"
            )
            .mockImplementationOnce(
                (): any => { 
                return complitVoucher; 
        });
        
        const promise = await voucherService.applyVoucher(vaucher.code, value);

        expect(promise).toEqual({
            amount: value, 
            applied: false, 
            discount: vaucher.discount, 
            finalAmount: value
        });
      });
      it("Testando para valor maior que 100",async ()=>{
        const value = 101;
        jest.spyOn(
            voucherRepository, 
            "getVoucherByCode"
            )
            .mockImplementationOnce(
                (): any => { 
                return complitVoucher; 
        });
        jest.spyOn(
            voucherRepository, 
            "useVoucher"
            )
            .mockImplementationOnce(
                (): any => { 
                return vaucher.code; 
        });
        
        
        const promise = await voucherService.applyVoucher(vaucher.code, value);

        expect(promise).toEqual({
            amount: value, 
            applied: true, 
            discount: vaucher.discount, 
            finalAmount: value-(value*(vaucher.discount/100))
        });
      });
    });
});