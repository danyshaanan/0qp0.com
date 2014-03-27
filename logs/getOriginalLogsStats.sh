grep -hoe '[0-9]\+x[0-9]\+' log.*txt* | sort | uniq -c | sort

