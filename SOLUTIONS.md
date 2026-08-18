# Solution Code for Demo

Copy and paste these solutions into the Code Compiler Platform to demonstrate the working system.

---

## 1. Two Sum

**Problem:** Given an array of integers and a target, return indices of two numbers that add up to the target.

**Input format:** `[2,7,11,15] 9`

```python
import sys
import json

# Read input
input_data = sys.stdin.read().strip()

# Parse input - expecting format like "[2,7,11,15] 9"
parts = input_data.rsplit(' ', 1)
array_str = parts[0].strip('[]')
target = int(parts[1])

# Parse array
nums = [int(x.strip()) for x in array_str.split(',')]

# Two Sum solution
seen = {}
for i, num in enumerate(nums):
    complement = target - num
    if complement in seen:
        result = [seen[complement], i]
        print(json.dumps(result, separators=(',', ':')))  # outputs [0,1] not [0, 1]
        break
    seen[num] = i
```

---

## 2. Reverse String

**Problem:** Reverse a string given as an array of characters.

**Input format:** `["h","e","l","l","o"]`

```python
import sys
import json

# Read input
input_data = sys.stdin.read().strip()

# Parse JSON array
chars = json.loads(input_data)

# Reverse in place
chars.reverse()

# Output as JSON array
print(json.dumps(chars))
```

---

## 3. Valid Palindrome

**Problem:** Check if a phrase is a palindrome after converting to lowercase and removing non-alphanumeric characters.

**Input format:** `A man, a plan, a canal: Panama`

```python
import sys

# Read input
input_data = sys.stdin.read().strip()

# Remove non-alphanumeric and convert to lowercase
cleaned = ''.join(c.lower() for c in input_data if c.isalnum())

# Check if palindrome
is_palindrome = cleaned == cleaned[::-1]

# Output
print(str(is_palindrome).lower())
```

---

## 4. Maximum Subarray

**Problem:** Find the contiguous subarray with the largest sum.

**Input format:** `[-2,1,-3,4,-1,2,1,-5,4]`

```python
import sys
import json

# Read input
input_data = sys.stdin.read().strip()

# Parse array
nums = json.loads(input_data)

# Kadane's algorithm
max_sum = nums[0]
current_sum = nums[0]

for i in range(1, len(nums)):
    current_sum = max(nums[i], current_sum + nums[i])
    max_sum = max(max_sum, current_sum)

print(max_sum)
```

---

## 5. Merge Two Sorted Lists

**Problem:** Merge two sorted lists into one sorted list.

**Input format:** `[1,2,4] [1,3,4]`

```python
import sys
import json

# Read input
input_data = sys.stdin.read().strip()

# Parse two arrays
parts = input_data.split('] [')
list1 = json.loads(parts[0] + ']')
list2 = json.loads('[' + parts[1])

# Merge
result = []
i, j = 0, 0

while i < len(list1) and j < len(list2):
    if list1[i] <= list2[j]:
        result.append(list1[i])
        i += 1
    else:
        result.append(list2[j])
        j += 1

# Add remaining elements
result.extend(list1[i:])
result.extend(list2[j:])

print(json.dumps(result))
```

---

## 6. Binary Search

**Problem:** Find target value in sorted array, return index or -1.

**Input format:** `[-1,0,3,5,9,12] 9`

```python
import sys
import json

# Read input
input_data = sys.stdin.read().strip()

# Parse input
parts = input_data.rsplit(' ', 1)
nums = json.loads(parts[0])
target = int(parts[1])

# Binary search
left, right = 0, len(nums) - 1

while left <= right:
    mid = (left + right) // 2
    if nums[mid] == target:
        print(mid)
        break
    elif nums[mid] < target:
        left = mid + 1
    else:
        right = mid - 1
else:
    print(-1)
```

---

## 7. Climbing Stairs

**Problem:** How many distinct ways to climb n steps (1 or 2 steps at a time)?

**Input format:** `3`

```python
import sys

# Read input
n = int(sys.stdin.read().strip())

# Dynamic programming - Fibonacci sequence
if n <= 2:
    print(n)
else:
    prev2, prev1 = 1, 2
    for i in range(3, n + 1):
        current = prev1 + prev2
        prev2, prev1 = prev1, current
    print(prev1)
```

---

## 8. Longest Common Prefix

**Problem:** Find the longest common prefix among an array of strings.

**Input format:** `["flower","flow","flight"]`

```python
import sys
import json

# Read input
input_data = sys.stdin.read().strip()

# Parse array
strs = json.loads(input_data)

if not strs:
    print("")
else:
    # Start with first string
    prefix = strs[0]
    
    # Compare with each string
    for s in strs[1:]:
        # Shorten prefix until it matches
        while not s.startswith(prefix):
            prefix = prefix[:-1]
            if not prefix:
                break
    
    print(prefix)
```

---

## 9. Find Peak Element

**Problem:** Find a peak element (greater than its neighbors).

**Input format:** `[1,2,3,1]`

```python
import sys
import json

# Read input
input_data = sys.stdin.read().strip()

# Parse array
nums = json.loads(input_data)

# Binary search for peak
left, right = 0, len(nums) - 1

while left < right:
    mid = (left + right) // 2
    if nums[mid] > nums[mid + 1]:
        # Peak is on the left side (including mid)
        right = mid
    else:
        # Peak is on the right side
        left = mid + 1

print(left)
```

---

## 10. Product of Array Except Self

**Problem:** Return array where each element is the product of all other elements (no division).

**Input format:** `[1,2,3,4]`

```python
import sys
import json

# Read input
input_data = sys.stdin.read().strip()

# Parse array
nums = json.loads(input_data)

n = len(nums)
result = [1] * n

# Left pass
left_product = 1
for i in range(n):
    result[i] = left_product
    left_product *= nums[i]

# Right pass
right_product = 1
for i in range(n - 1, -1, -1):
    result[i] *= right_product
    right_product *= nums[i]

print(json.dumps(result))
```

---

## 11. Rotate Array

**Problem:** Rotate array to the right by k steps.

**Input format:** `[1,2,3,4,5,6,7] 3`

```python
import sys
import json

# Read input
input_data = sys.stdin.read().strip()

# Parse input
parts = input_data.rsplit(' ', 1)
nums = json.loads(parts[0])
k = int(parts[1])

# Normalize k
n = len(nums)
k = k % n

# Rotate using reverse method
def reverse(arr, start, end):
    while start < end:
        arr[start], arr[end] = arr[end], arr[start]
        start += 1
        end -= 1

reverse(nums, 0, n - 1)
reverse(nums, 0, k - 1)
reverse(nums, k, n - 1)

print(json.dumps(nums))
```

---

## How to Use

1. **Login** as any user (or register a new account)
2. **Navigate to Problems** page
3. **Select a question** from the list
4. **Copy the solution** code from above
5. **Paste** into the code editor
6. **Select language:** Python
7. **Click "Submit Code"** to judge against all test cases

## Expected Results

- ✅ All solutions should pass with **100% score** and **"Accepted"** status
- Solutions use O(n) or O(log n) time complexity where appropriate
- All handle edge cases properly
- Input/output format matches the test case expectations

## Demo Tips

1. **Run Code** first to test with sample input
2. **Submit Code** to see full test case results
3. Check **Leaderboard** after successful submissions to see ranking
4. **Admin view** at `/admin/submissions` shows all user submissions
5. Try submitting with intentional errors to demo "Wrong Answer" or "Runtime Error" verdicts
