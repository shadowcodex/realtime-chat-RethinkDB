/*global helpers, expect*/
describe("Messages", function(){
    
    it("Check Test", function() {
        expect(checkTest()).toBe(true);
    });
    
    it("Get Message Request", function(){
       expect(loadMessages("/message/all")).toBe(200); 
    });
    
    it("Send New Message", function(){
        expect(sendMessage("/message/send", {message: "test message", name: "Shannon"})).toBe(200);
    });
    
});