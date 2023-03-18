<script>
	import ToDoList from './lib/ToDoList.svelte';
	import { v4 as uuid } from 'uuid';
	import { onMount, tick } from 'svelte';
	import { blur, fly, slide } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';

	let toDoListBox;
	let showList = true;

	let toDoLists = null;
	let error = null;
	let isLoading = false;
	let isAdding = false;
	let disabledItems = [];

	onMount(() => {
		LOAD_toDoLists();
	});

	async function LOAD_toDoLists() {
		isLoading = true;

		await fetch('https://jsonplaceholder.typicode.com/todos?_limit=10').then(async (response) => {
			if (response.ok) {
				toDoLists = await response.json();
			} else {
				error = 'An error has occured.';
			}
		});

		isLoading = false;
	}

	async function handleAddToDoLists(event) {
		event.preventDefault();
		isAdding = true;

		await fetch('https://jsonplaceholder.typicode.com/todos', {
			method: 'POST',
			body: JSON.stringify({
				title: event.detail.title,
				completed: false
			}),
			headers: {
				'Content-type': 'application/json;charset=UTF-8'
			}
		}).then(async (response) => {
			if (response.ok) {
				const toDoList = await response.json();
				toDoLists = [...toDoLists, { ...toDoList, id: uuid() }];
				toDoListBox.clearInput();
			} else {
				alert('An error has occured.');
			}
		});

		isAdding = false;
		await tick();
		toDoListBox.focusInput();
	}

	async function handleRemoveToDoLists(event) {
		const id = event.detail.id;
		if (disabledItems.includes(id)) return;

		disabledItems = [...disabledItems, id];

		await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
			method: 'DELETE'
		}).then((response) => {
			if (response.ok) {
				toDoLists = toDoLists.filter((toDoItem) => toDoItem.id !== event.detail.id);
			} else {
				alert('An error has occured.');
			}
		});

		disabledItems = disabledItems.filter((itemID) => itemID !== id);
	}

	async function handleToggleToDoLists(event) {
		const id = event.detail.id;
		const value = event.detail.value;
		if (disabledItems.includes(id)) return;

		await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
			method: 'PATCH',
			body: JSON.stringify({
				completed: value
			}),
			headers: {
				'Content-type': 'application/json;charset=UTF-8'
			}
		}).then(async (response) => {
			if (response.ok) {
				const updateToDoLists = await response.json();

				toDoLists = toDoLists.map((toDoItem) => {
					if (toDoItem.id === event.detail.id) {
						return updateToDoLists;
					}
					return { ...toDoItem };
				});
			}

			disabledItems = disabledItems.filter((itemID) => itemID !== id);
		});
	}
</script>

{#if toDoLists}
  <p>
    {#if toDoLists.length == 0}
			<span style:display="inline-block" in:fly|local={{ y: -10 }}>No</span> item
    {:else if toDoLists.length == 1}
      <span style:display="inline-block" in:fly|local={{ y: -10 }}>1</span> item
    {:else}
      {#key toDoLists.length}
        <span style:display="inline-block" in:fly|local={{ y: -10 }}>{toDoLists.length}</span>
      {/key}
      items
    {/if}
  </p>
{/if}

<label>
	<input type="checkbox" bind:checked={showList} />
	{showList ? 'Hide Tasks' : 'Show Tasks'}
</label>

{#if showList}
	<div
		in:slide={{ duration: 300, easing: cubicInOut }}
		out:blur={{ duration: 500, amount: 10 }}
		style:max-width="45rem"
	>
		<ToDoList
			{toDoLists}
			{error}
			{isLoading}
			{disabledItems}
			disableAdding={isAdding}
			bind:this={toDoListBox}
			on:addtodo={handleAddToDoLists}
			on:removetodo={handleRemoveToDoLists}
			on:toggletodo={handleToggleToDoLists}
			let:toDoList
			let:index
		>
			<span slot="title">{index + 1}. {toDoList.title}</span>
		</ToDoList>
	</div>
{/if}

<style>
</style>
