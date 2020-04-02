var Store = /** @class */ (function () {
    function Store(prefix) {
        if (prefix === void 0) { prefix = 'UPLOADX-V3.0-'; }
        this.prefix = prefix;
    }
    Store.prototype.set = function (key, value) {
        localStorage.setItem(this.prefix + key, value);
    };
    Store.prototype.get = function (key) {
        return localStorage.getItem(this.prefix + key);
    };
    Store.prototype.delete = function (key) {
        localStorage.removeItem(this.prefix + key);
    };
    return Store;
}());
export var store = 'localStorage' in window ? new Store() : new Map();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtdXBsb2FkeC8iLCJzb3VyY2VzIjpbImxpYi9zdG9yZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtJQUNFLGVBQW1CLE1BQXdCO1FBQXhCLHVCQUFBLEVBQUEsd0JBQXdCO1FBQXhCLFdBQU0sR0FBTixNQUFNLENBQWtCO0lBQUcsQ0FBQztJQUMvQyxtQkFBRyxHQUFILFVBQUksR0FBVyxFQUFFLEtBQWE7UUFDNUIsWUFBWSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBQ0QsbUJBQUcsR0FBSCxVQUFJLEdBQVc7UUFDYixPQUFPLFlBQVksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBQ0Qsc0JBQU0sR0FBTixVQUFPLEdBQVc7UUFDaEIsWUFBWSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFDSCxZQUFDO0FBQUQsQ0FBQyxBQVhELElBV0M7QUFDRCxNQUFNLENBQUMsSUFBTSxLQUFLLEdBQUcsY0FBYyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLEVBQWtCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBTdG9yZSB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBwcmVmaXggPSAnVVBMT0FEWC1WMy4wLScpIHt9XG4gIHNldChrZXk6IHN0cmluZywgdmFsdWU6IHN0cmluZykge1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMucHJlZml4ICsga2V5LCB2YWx1ZSk7XG4gIH1cbiAgZ2V0KGtleTogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCB8IGZhbHNlIHtcbiAgICByZXR1cm4gbG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5wcmVmaXggKyBrZXkpO1xuICB9XG4gIGRlbGV0ZShrZXk6IHN0cmluZykge1xuICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKHRoaXMucHJlZml4ICsga2V5KTtcbiAgfVxufVxuZXhwb3J0IGNvbnN0IHN0b3JlID0gJ2xvY2FsU3RvcmFnZScgaW4gd2luZG93ID8gbmV3IFN0b3JlKCkgOiBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpO1xuIl19