uniform float uSize;
uniform vec2 uResolution;

attribute float aSize;

void main() {
    // Final position
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

    // Final particle size
    gl_PointSize = uSize * uResolution.y * aSize; // fix particles size according to vertical FOV so it scales if window is resized vertically (not horizontally)
    gl_PointSize *= 1.0 / - viewPosition.z; // perspective based size
}