function swap(items, firstIndex, secondIndex){
    var temp = items[firstIndex];
    items[firstIndex] = items[secondIndex];
    items[secondIndex] = temp;
}

function compare(a, b){
	return a < b ? -1 : (a > b ? 1 : 0);
}

function median(a, b, c){
	return a > b ? (b > c ? b : (a > c ? c : a)) : (a > c ? a : (b > c ? c : b));
}

function partition(A, fn, lo, hi) {
    var pivot = median(A[lo], A[hi], A[Math.floor((lo + hi) / 2)]),
        i     = lo - 1,
        j     = hi + 1;
		
    do {
        do {
			i++;
        } while (fn(A[i], pivot) == -1);
        do {
			j--;
        } while (fn(A[j], pivot) == 1);
		if (i >= j){
			return j;
		}
		swap(A, i, j);
    } while (true);
}

function quicksort(A, fn, lo, hi) {
	lo = typeof lo != "number" ? 0 : lo;
	hi = typeof hi != "number" ? A.length - 1 : hi;
	
	fn = fn || compare;
	
	if (lo < hi){
		var p = partition(A, fn, lo, hi);
		
		console.log(p, lo, hi);

		quicksort(A, fn, lo, p);
		quicksort(A, fn, p + 1, hi);
	}

    return A;
}
