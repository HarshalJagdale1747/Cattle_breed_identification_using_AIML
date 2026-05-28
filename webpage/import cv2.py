import cv2

img = cv2.imread(r'C:\Users\Harshal Jagdale\Pictures\WhatsApp Image 2026-04-09 at 09.58.05.jpeg')

cv2.imshow('Image', img)
cv2.waitKey(0)
cv2.destroyAllWindows()
# Convert to grayscale
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# -----------------------------
# 1. Thresholding
# -----------------------------
_, thresh = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY)

# -----------------------------
# 2. Gray Level Slicing
# -----------------------------
slice_img = np.zeros_like(gray)
slice_img[(gray > 100) & (gray < 180)] = 255

# -----------------------------
# 3. Bit Plane Slicing
# -----------------------------
bit_planes = []
for i in range(8):
    bit_plane = (gray >> i) & 1
    bit_planes.append(bit_plane * 255)

# -----------------------------
# 4. Log Transformation
# -----------------------------
c = 255 / np.log(1 + np.max(gray))
log_img = c * np.log(1 + gray.astype(float))
log_img = np.array(log_img, dtype=np.uint8)

# -----------------------------
# 5. Gamma Transformation
# -----------------------------
gamma1 = 0.4
gamma2 = 2.2

gamma_img1 = np.array(255 * (gray/255) ** gamma1, dtype=np.uint8)
gamma_img2 = np.array(255 * (gray/255) ** gamma2, dtype=np.uint8)

# -----------------------------
# 6. Low Pass Filters
# -----------------------------
avg = cv2.blur(gray, (3,3))
gauss = cv2.GaussianBlur(gray, (3,3), 0)
median = cv2.medianBlur(gray, 3)

# -----------------------------
# 7. High Pass Filter (Laplacian)
# -----------------------------
laplacian = cv2.Laplacian(gray, cv2.CV_64F)
laplacian = np.uint8(np.absolute(laplacian))

# -----------------------------
# Display Results
# -----------------------------
plt.figure(figsize=(12,10))

plt.subplot(3,3,1), plt.imshow(gray, cmap='gray'), plt.title('Original')

plt.subplot(3,3,2), plt.imshow(thresh, cmap='gray'), plt.title('Thresholding')

plt.subplot(3,3,3), plt.imshow(slice_img, cmap='gray'), plt.title('Gray Level Slicing')

plt.subplot(3,3,4), plt.imshow(bit_planes[7], cmap='gray'), plt.title('Bit Plane 7')

plt.subplot(3,3,5), plt.imshow(log_img, cmap='gray'), plt.title('Log Transform')

plt.subplot(3,3,6), plt.imshow(gamma_img1, cmap='gray'), plt.title('Gamma 0.4')

plt.subplot(3,3,7), plt.imshow(avg, cmap='gray'), plt.title('Average Filter')

plt.subplot(3,3,8), plt.imshow(laplacian, cmap='gray'), plt.title('High Pass')

plt.subplot(3,3,9), plt.imshow(gamma_img2, cmap='gray'), plt.title('Gamma 2.2')

plt.tight_layout()
plt.show()