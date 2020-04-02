class Store {
    constructor(prefix = 'UPLOADX-V3.0-') {
        this.prefix = prefix;
    }
    set(key, value) {
        localStorage.setItem(this.prefix + key, value);
    }
    get(key) {
        return localStorage.getItem(this.prefix + key);
    }
    delete(key) {
        localStorage.removeItem(this.prefix + key);
    }
}
export const store = 'localStorage' in window ? new Store() : new Map();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtdXBsb2FkeC8iLCJzb3VyY2VzIjpbImxpYi9zdG9yZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNLEtBQUs7SUFDVCxZQUFtQixTQUFTLGVBQWU7UUFBeEIsV0FBTSxHQUFOLE1BQU0sQ0FBa0I7SUFBRyxDQUFDO0lBQy9DLEdBQUcsQ0FBQyxHQUFXLEVBQUUsS0FBYTtRQUM1QixZQUFZLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFDRCxHQUFHLENBQUMsR0FBVztRQUNiLE9BQU8sWUFBWSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFDRCxNQUFNLENBQUMsR0FBVztRQUNoQixZQUFZLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLENBQUM7SUFDN0MsQ0FBQztDQUNGO0FBQ0QsTUFBTSxDQUFDLE1BQU0sS0FBSyxHQUFHLGNBQWMsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxFQUFrQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgU3RvcmUge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgcHJlZml4ID0gJ1VQTE9BRFgtVjMuMC0nKSB7fVxuICBzZXQoa2V5OiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpIHtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLnByZWZpeCArIGtleSwgdmFsdWUpO1xuICB9XG4gIGdldChrZXk6IHN0cmluZyk6IHN0cmluZyB8IG51bGwgfCBmYWxzZSB7XG4gICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMucHJlZml4ICsga2V5KTtcbiAgfVxuICBkZWxldGUoa2V5OiBzdHJpbmcpIHtcbiAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSh0aGlzLnByZWZpeCArIGtleSk7XG4gIH1cbn1cbmV4cG9ydCBjb25zdCBzdG9yZSA9ICdsb2NhbFN0b3JhZ2UnIGluIHdpbmRvdyA/IG5ldyBTdG9yZSgpIDogbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTtcbiJdfQ==