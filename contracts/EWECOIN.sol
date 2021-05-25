// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract EWECOIN {
  mapping(address => uint256) private _balances;
  mapping(address => mapping (address => uint256)) allowed;
  string private _name;
  string private _symbol;
  uint256 private _totalSupply;
address private _owner;
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
	  event Transfer(address indexed from, address indexed to, uint tokens);

  constructor(address owner_, uint256 totalSupply_) {
    _name = "EWECOIN";
    _symbol = "EWE";
    _owner = owner_;
        _totalSupply = totalSupply_;
    _balances[owner_] = totalSupply_;
    emit Transfer(address(0), owner_, totalSupply_);
  }

  function transfer( address receipient, uint256 amounToken) public {
    require(_balances[msg.sender] >= amounToken, "EWECOIN: Insuffisiant balance! Check your amounToken");
  _balances[msg.sender] -= amounToken;
    _balances[receipient] += amounToken;
    emit Transfer (msg.sender, receipient, amounToken);
  }

function transferFrom(address sender, address receipient, uint256 amounToken) public  {
	    require(_balances[sender] >= amounToken, "EWECOIN: Insuffisiant balance! Check your amounToken");
  _balances[sender] -= amounToken;
    _balances[receipient] += amounToken;
    emit Transfer (sender, receipient, amounToken);
	    }




  function approve(address delegate, uint256 value) public {
          allowed[msg.sender][delegate] = value;
 	        emit Approval(msg.sender, delegate, value);
  }
  



  function name() public view returns (string memory) {
    return _name;
  }

  function symbol() public view returns (string memory) {
    return _symbol;
  }

  function totalSupply() public view returns (uint256) {
    return _totalSupply;
  }

  function balanceOf(address account) public view returns (uint256) {
    return _balances[account];
  }

    function allowance(address owner, address delegate) public  view returns (uint) {
	        return allowed[owner][delegate];
	    }

}