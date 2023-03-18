<script>
  export let size = 'small';
  export let shadow = false;
  export let bgColor = 'inherit';
  export let textColor = 'inherit';
  
  let isLeftHover;
</script>



<button
  on:click
  style:--buttonBgColor={bgColor}
  style:--buttonTextColor={textColor}
  class:size-sm={size === 'small'}
  class:size-lg={size === 'large'}
  class:has-left={$$slots.leftContent}
  class:shadow
  {...$$restProps}
>
  {#if $$slots.leftContent}
    <div 
      class="left-content" 
      on:mouseenter={() => (isLeftHover = true)}
      on:mouseleave={() => (isLeftHover = false)}
    >
      <slot name="leftContent" />
    </div>
  {/if}
  <slot {isLeftHover}>Fallback</slot>
</button>



<style lang="scss">
  button {
    display: flex;
    align-items: center;
    border: none;
    background-color: var(--buttonBgColor);
    color: var(--buttonTextColor);
    font-weight: bold;
    border-radius: 5rem;
    cursor: pointer;
    .left-content {
      margin-right: 1rem;
    }
    &:hover {
      background-image: linear-gradient(orangered, red, orangered);
    }
    &:active {
      background-image: radial-gradient(circle, rgba(255,120,0,1) 0%, rgba(255,69,0,1) 50%, rgba(255,69,0,1) 100%);
    }
    &.size-sm {
      padding: 0.5rem 1rem;
      font-size: small;
    }
    &.size-lg {
      padding: 1rem 2rem;
      font-size: large; 
    }
    &.shadow {
      box-shadow: 0 0 5rem rgba(145, 200, 240, 0.6);
    }
  }
</style>