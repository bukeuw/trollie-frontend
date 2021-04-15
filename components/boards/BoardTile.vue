<template>
  <div
    class="board-tile"
    :class="mod === 'create' ? 'mod-create' : ''"
    :style="`background-color: ${color}`"
  >
    <p>{{ title }}</p>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: '#ccc'
    },
    mod: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
.board-tile {
  background-size: cover;
  background-position: 50%;
  display: block;
  color: #fff;
  line-height: 20px;
  padding: 8px;
  text-decoration: none;
  border-radius: 3px;
  height: 80px;
}
.board-tile.mod-create {
  display: table-cell;
  color: #712b4d;
  font-weight: 400;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
}
</style>
