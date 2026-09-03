function SearchInput() {
  return (
    <div>
      <label htmlFor="search">Search</label>

      <input
        id="search"
        type="text"
        placeholder="Search users or posts..."
      />
    </div>
  );
}

export default SearchInput;